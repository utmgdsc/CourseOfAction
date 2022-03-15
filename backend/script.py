# from io import StringIO
# from pdfminer.high_level import extract_text_to_fp
# from pdfminer.layout import LAParams
#
# FILENAME = 'CSC301H5S.pdf'
#
# output = StringIO()
# with open(FILENAME, 'rb') as pdf_file:
#     extract_text_to_fp(pdf_file, output, laparams=LAParams(), output_type='html', codec=None)
# with open('example.html', 'w') as html_file:
#     html_file.write(output.getvalue())
#
# from lxml import html
#
# tree = html.fromstring('example.html')
# divs = tree.xpath('.//div')
import math

from tabula import read_pdf


# Edge Case (can be handled)
# df = read_pdf("CSC301H5S.pdf", pages='all', multiple_tables=True, output_format='json')
# print(df[0])


def extract_info(filename):
    dfs = read_pdf(filename, pages='all')
    # try:
    dfs[0].drop(["Description"], axis=1)
    assessments = []
    for i in range(len(dfs[0]["Type"])):
        name = str(dfs[0]["Type"][i])
        due_date = str(dfs[0]["Due Date"][i])
        weight = str(dfs[0]["Weight"][i])
        is_nan = name == 'nan' or due_date == 'nan' or weight == 'nan'
        if name != "Total" and due_date != "Total" and weight != "100%" and not is_nan:
            assessment = {
                'name': name,
                'due_date': due_date,
                'weight': int(weight[:-1])
            }
            assessments.append(assessment)
    return assessments
    # except:
    #     return 0


# For testing purposes
if __name__ == '__main__':
    FILENAME = 'CSC108H5S.pdf'
    print(extract_info(FILENAME))
    FILENAME = 'CSC427H5.pdf'
    print(extract_info(FILENAME))
