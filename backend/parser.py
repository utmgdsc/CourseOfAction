from tabula import read_pdf
import pandas as pd

# Edge Case (can be handled)
# df = read_pdf("CSC301H5S.pdf", pages='all', multiple_tables=True, output_format='json')
# print(df[0])


def extract_info(filename):
    try:
        # Extracting tables from pdf
        dfs = read_pdf(filename, pages='all')
        assessments = []
        # Need this to keep track if we make change for weight offset
        weight_type = "Weight"

        # If there is an offset of weight then renaming unnamed one to weight
        if dfs[0][weight_type].isnull().all():
            dfs[0] = dfs[0].drop(weight_type, axis=1).reindex()
            weight_type = "Unnamed: 0"

        df_combine = pd.DataFrame([])

        # Adding dfs[0] to df_combine
        df_combine = pd.concat([dfs[0], df_combine], )

        # Only need to find more data if the first table does not have all assessment
        # information
        if str(df_combine.iloc[-1, 3]) != '100%':
            for i in range(1, len(dfs)):
                # Remove the last row is it is 100% or nan since it is the end
                isEnd = str(dfs[i].iloc[-1, 3]) == '100%' or str(dfs[i].iloc[-1, 3]) == 'nan'
                if isEnd:
                    dfs[i].drop(dfs[1].tail(1).index, inplace=True)
                # Renaming columns
                dfs[i] = dfs[i].set_axis(["Type", "Description", "Due Date", weight_type], axis=1)
                df_combine = pd.concat([dfs[i], df_combine], axis=0, ignore_index=True)
                # Breaking so we don't append any other table
                if isEnd:
                    break

        dfs = df_combine

        # Parsing the dfs data to a list with assessments as objects
        for i in range(len(dfs["Type"])):
            name = str(dfs["Type"][i])
            due_date = str(dfs["Due Date"][i])
            weight = str(dfs[weight_type][i])
            is_nan = name == 'nan' or due_date == 'nan' or weight == 'nan'
            if name != "Total" and due_date != "Total" and weight != "100%" and not is_nan:
                assessment = {
                    'name': name,
                    'due_date': due_date,
                    'weight': int(weight[:-1])
                }
                assessments.append(assessment)

        # Managing same names by adding 2, 3, 4, etc. for same assessment name
        # eg: second assessment in the course syllabus becomes "assessment 2"
        uniq_assessment = set([assessment['name'] for assessment in assessments])
        assessment_dic = dict.fromkeys(uniq_assessment, 1)
        for assessment in assessments:
            name = assessment['name']
            if name in uniq_assessment and assessment_dic[name] > 1:
                assessment['name'] = name + " " + str(assessment_dic[name])
            assessment_dic[name] += 1
        return assessments
    except:
        return 0


# For testing purposes
if __name__ == '__main__':
    import os
    for file in os.listdir("parser_test"):
        print(file)
        FILENAME = "parser_test" + os.sep + str(file)
        print(extract_info(FILENAME))
