# Task 8: Submission assembly

The written submission (Tasks 1–7) as one document, built from the task files so the numbers can't drift apart.

| File | What it is |
|---|---|
| [executive-summary.md](executive-summary.md) | Page 1: the links and the six decisions |
| [build_submission.py](build_submission.py) | Assembles the task files in the brief's order, makes every link absolute, runs the checks below |
| [submission.md](submission.md) | The assembled document (generated; edit the task files, not this) |
| [submission.html](submission.html) | The same, formatted. Upload this to Google Drive and print it as the PDF |

## Checks (run by the script, 17 Oct 2026)

All pass: the system prompt is 238 words (brief: 150–250); Tasks 1–7 are all present; the prototype and model links are present; no relative links are left; no old FreshBrew investment figure (₹40L) remains. A test PDF printed from `submission.html` has 33 A4 pages and 84 clickable links.

Task 1 appears as its three TL;DRs, the key numbers and links to the full 25-page Task 1 document. Every other task is included in full.

## Status: waiting on the owner

**Task 7 still has 19 placeholders** (self-ratings, the complex-problem story, LinkedIn and PMgirlz links, a Lovable project link). Only Bhawna can fill them. Then:

1. Fill the placeholders in [`task7-how-you-work.md`](../R7-how-you-work/task7-how-you-work.md) and delete its "Draft" note.
2. Run `python build_submission.py`. It prints the number of placeholders left; it should be 0.
3. Upload `submission.html` to Google Drive, then **Open with → Google Docs**.
4. Share the Doc and the [Task 5 model](https://docs.google.com/spreadsheets/d/1hvPhC2OA14JhPUtjZFc1rd907xJMpPJtFsQDe7I6YeA/edit) as "Anyone with the link can view". Open both, and the prototype, in an incognito window.
5. **File → Download → PDF** from the Doc; click two or three links in the PDF to check them.
6. Submit the Doc link, the PDF, the prototype URL and the model link.

The Google Doc was not created from here on purpose: it would have to be redone once Task 7 is filled in.
