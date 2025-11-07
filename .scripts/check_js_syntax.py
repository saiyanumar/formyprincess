import re
import sys
path = r"c:\Users\Umar Khan\formyprincess\public\diwali\script.js"
text = open(path, 'r', encoding='utf8').read()
errors = []

# Check brace balance
brace = 0
line_no = 1
for ch in text:
    if ch == '\n':
        line_no += 1
    if ch == '{':
        brace += 1
    elif ch == '}':
        brace -= 1
        if brace < -1000000:
            break

if brace != 0:
    errors.append(f"Unbalanced braces: net {brace}")

# Find try blocks and ensure they are followed by catch or finally
for m in re.finditer(r"\btry\s*\{", text):
    start = m.end() - 1
    # Find end of this block by counting braces
    i = start
    depth = 0
    end_index = None
    while i < len(text):
        if text[i] == '{':
            depth += 1
        elif text[i] == '}':
            depth -= 1
            if depth == 0:
                end_index = i
                break
        i += 1
    # get snippet after the block
    after = text[end_index+1:end_index+80] if end_index else text[m.start():m.start()+80]
    # look for catch or finally skipping whitespace/comments
    after_strip = re.sub(r"^\s+", "", after)
    if not re.match(r"^(catch|finally)\b", after_strip):
        # compute line number
        line = text[:m.start()].count('\n') + 1
        errors.append(f"Bare try at line {line}: maybe missing catch/finally")

if errors:
    print('ISSUES_FOUND')
    for e in errors:
        print(e)
    sys.exit(1)
else:
    print('NO_ISSUES')
    sys.exit(0)
