import os
import ast
import sys
import subprocess

# Set the root directory (change this if needed)
PROJECT_ROOT = os.path.abspath(".")

# Built-in module names to ignore
BUILTINS = set(sys.builtin_module_names)

# Helper function to check if a module is standard library
def is_std_lib(module_name):
    try:
        file = __import__(module_name).__file__
        return 'site-packages' not in (file or '')
    except:
        return True  # If we can't import, assume it's built-in or not installed

# Gather all imports
imported_modules = set()

for root, _, files in os.walk(PROJECT_ROOT):
    for file in files:
        if file.endswith(".py"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                try:
                    tree = ast.parse(f.read(), filename=path)
                    for node in ast.walk(tree):
                        if isinstance(node, ast.Import):
                            for alias in node.names:
                                imported_modules.add(alias.name.split('.')[0])
                        elif isinstance(node, ast.ImportFrom):
                            if node.module:
                                imported_modules.add(node.module.split('.')[0])
                except Exception as e:
                    print(f"Failed to parse {path}: {e}")

# Filter out standard/built-in modules
external_modules = [mod for mod in imported_modules if not is_std_lib(mod)]

# Try to get package names with pip freeze
try:
    freeze_output = subprocess.check_output([sys.executable, "-m", "pip", "freeze"], text=True)
    package_versions = {line.split("==")[0].lower(): line for line in freeze_output.splitlines() if "==" in line}

    requirements = []
    for mod in sorted(set(external_modules)):
        if mod.lower() in package_versions:
            requirements.append(package_versions[mod.lower()])
        else:
            requirements.append(mod)  # fallback if not found in freeze

    # Write to requirements.txt
    with open("requirements.txt", "w") as req_file:
        req_file.write("\n".join(requirements))

    print("✅ requirements.txt generated successfully.")

except Exception as e:
    print("⚠️ Error using pip freeze:", e)
    print("Modules found:", sorted(external_modules))
