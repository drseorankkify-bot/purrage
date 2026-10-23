"""Adds the Guides menu script tag to every .html page in a folder.
Usage:  python3 add_menu.py path/to/your/site
Safe to run more than once: pages that already have it are skipped."""
import sys, pathlib
TAG = '<script src="/js/menu.js" defer></script>'
root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
done = skipped = 0
for f in sorted(root.rglob('*.html')):
    if any(p in f.parts for p in ('node_modules', '.git')):
        continue
    s = f.read_text(encoding='utf-8')
    if 'menu.js' in s or '</body>' not in s:
        skipped += 1
        continue
    f.write_text(s.replace('</body>', '    ' + TAG + '\n  </body>', 1), encoding='utf-8')
    done += 1
    print('updated', f)
print(f'{done} pages updated, {skipped} skipped')
