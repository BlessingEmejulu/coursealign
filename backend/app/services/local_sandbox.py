import ast
import subprocess
import os

DANGEROUS_IMPORTS = {"os", "sys", "subprocess", "socket", "urllib", "requests", "http", "shutil", "pty", "commands"}
DANGEROUS_CALLS = {"open", "eval", "exec", "compile", "__import__"}

def is_code_safe(code_str: str) -> bool:
    try:
        tree = ast.parse(code_str)
    except SyntaxError:
        return False

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name.split('.')[0] in DANGEROUS_IMPORTS:
                    return False
        elif isinstance(node, ast.ImportFrom):
            if node.module and node.module.split('.')[0] in DANGEROUS_IMPORTS:
                return False
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id in DANGEROUS_CALLS:
                return False
        elif isinstance(node, ast.Attribute):
            if node.attr.startswith('__'):
                return False
    return True

def run_local_code(code_str: str, timeout_seconds=5) -> str:
    if not is_code_safe(code_str):
        return "Error: Security Sandbox blocked execution. Unsafe imports or functions detected."
    
    wrapper_code = f"""
import resource
import sys

# Set CPU time limit
try:
    resource.setrlimit(resource.RLIMIT_CPU, ({timeout_seconds}, {timeout_seconds}))
except ValueError:
    pass

# Set Memory limit to 100MB
try:
    resource.setrlimit(resource.RLIMIT_AS, (100 * 1024 * 1024, 100 * 1024 * 1024))
except ValueError:
    pass

# Set File Size limit to 0 (cannot write any files)
try:
    resource.setrlimit(resource.RLIMIT_FSIZE, (0, 0))
except ValueError:
    pass

# Strip dangerous builtins
try:
    del __builtins__.open
    del __builtins__.eval
except AttributeError:
    pass

try:
    exec({repr(code_str)}, {{"__builtins__": __builtins__}})
except Exception as e:
    print(f"Runtime Error: {{e}}", file=sys.stderr)
"""
    
    def drop_privileges():
        try:
            import pwd
            nobody = pwd.getpwnam('nobody')
            os.setgid(nobody.pw_gid)
            os.setuid(nobody.pw_uid)
        except Exception:
            pass

    try:
        result = subprocess.run(
            ["python3", "-c", wrapper_code],
            capture_output=True,
            text=True,
            timeout=timeout_seconds + 1,
            preexec_fn=drop_privileges
        )
        
        output = result.stdout
        if result.stderr:
            output += "\nErrors:\n" + result.stderr
            
        return output.strip() if output else "Executed successfully with no output."
    except subprocess.TimeoutExpired:
        return f"Error: Execution timed out after {timeout_seconds} seconds."
    except Exception as e:
        return f"Execution failed: {str(e)}"
