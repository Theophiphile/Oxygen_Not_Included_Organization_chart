import sys
import polib
po = polib.pofile(sys.argv[1])
valid_entries = [e for e in po if not e.obsolete]
for entry in valid_entries:
    if entry.msgctxt.endswith('.NAME'):
        if entry.msgctxt.startswith('STRINGS.ELEMENTS.') or entry.msgctxt.startswith('STRINGS.CREATURES.SPECIES.'):
            print(entry.msgid, entry.msgctxt)