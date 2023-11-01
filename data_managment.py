'''
A program with various data management functions to help clean and prep data for other functions
'''

import pandas as pd


def main():
    input_file = "titles_rated-indeed_remote_entry-level_python_bachelors-10_1_23.csv"
    output_file = input_file
    trim_data_to_unique_ids(input_file, output_file)


# Note that the input file should be organized as an array of dictionaries
def trim_data_to_unique_ids(input_file, output_file):
    df = pd.read_csv(input_file)

    before_size = df.shape[0]
    trimmed = df.drop_duplicates(subset=['id'])

    trimmed.to_csv(output_file, index=False)

    after_size = trimmed.shape[0]
    print(input_file, "trimmed and output to", output_file)
    print("Size before:", before_size, "Size after trim:", after_size)

    # data = trimmed.to_dict('records')
    # print_array(data)


def print_array(array):
    for a in array:
        print(a)


main()