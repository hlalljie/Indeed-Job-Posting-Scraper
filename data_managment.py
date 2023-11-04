'''
A program with various data management functions to help clean and prep data for other functions
'''

import pandas as pd
import numpy as np


def main():
    # Set input and output individual sheet operation (right now just finding the diff between data)
    individual_input_files = [
        "Output/large_title_test_1.csv",
        "Output/large_title_test_2.csv",
        "Output/large_title_test_3.csv",
        "Output/large_title_test_4.csv",
        "Output/large_title_test_5.csv"
    ]
    individual_output_files = [
        "Final/large_title_test_1_final.csv",
        "Final/large_title_test_2_final.csv",
        "Final/large_title_test_3_final.csv",
        "Final/large_title_test_4_final.csv",
        "Final/large_title_test_5_final.csv"
    ]
    title = "Title Test"
    if len(individual_input_files) != len(individual_output_files):
        print("Input and output file lists must be the same length")
        return
    all_stats_file = "Final/large_title_test_stats.csv"

    all_stats = []

    for i in range(len(individual_input_files)):
        # Read from csv
        df = pd.read_csv(individual_input_files[i])

        # Update data_list with difference between Brain.js rating and my rating
        data_list = df.to_dict(orient="records")
        findRatingDiff(data_list)

        # Create dataframe from the dictionary and write to csv
        df = pd.DataFrame(data_list)
        df.to_csv(individual_output_files[i], index=False)

        # Find statistics for the test and add them to the all stats dict
        new_stats = findListPropAndStats(df, "Title Test " + str(i+1))
        all_stats.append(new_stats)

    # Write all stats
    all_stats_df = pd.DataFrame(all_stats)
    all_stats_df.to_csv(all_stats_file, index=False)
    #print(all_stats_df)


# returns dictionary so dataframe doesn't need to be initialized with column names
def findListPropAndStats(df, test_title, iqr_radius=.25):

    #Allow for printing all rows and columns for debugging
    pd.set_option('display.max_rows', None)
    pd.set_option('display.max_columns', None)

    pre_filter_size = df['brainjs-rating'].size
    # Drop rows with NaN values in the "brainjs-rating" column (non-numeric values)
    df['brainjs-rating'] = df['brainjs-rating'].apply(junk_filter)
    # Create a mask to identify rows with NaN in the "brainjs-rating" column
    mask = np.isnan(df['brainjs-rating'])
    # Apply the mask to the DataFrame to retain rows with valid "brainjs-rating" values
    df = df[~mask]
    junk = pre_filter_size - df['brainjs-rating'].size

    # Calculate IQR quantiles based on given range
    q_index_1 = .5 - iqr_radius
    q_index_3 = .5 + iqr_radius

    if not df.empty:
        statistics_df = {
            'Test Title': test_title,
            'Mean Rating': df['title-rating'].mean(),
            'BrainJS Mean Rating': df['brainjs-rating'].mean(),
            'Median Rating': df['title-rating'].median(),
            'BrainJS Median Rating': df['brainjs-rating'].median(),
            'Rating IQR': df['title-rating'].quantile(q_index_3) - df['title-rating'].quantile(q_index_1),
            'BrainJS IQR': df['brainjs-rating'].quantile(q_index_3) - df['brainjs-rating'].quantile(q_index_1),
            'Rating Outliers': countOutliers(df, "title-rating", q_index_1, q_index_3),
            'BrainJS Outliers': countOutliers(df, "brainjs-rating", q_index_1, q_index_3),
            'Rating Standard Deviation': df['title-rating'].std(),
            'BrainJS Standard Deviation': df['brainjs-rating'].std(),
            'Mean Rating Difference': df['rating-diff'].mean(),
            'Median Rating Difference': df['rating-diff'].median(),
            'Correct Guesses': df['rating-diff'].value_counts().get(0,0),
            'BrainJS Junk Count': junk
        }
    else:
        # Handle the case where there's no valid data
        statistics_df = {}
    return statistics_df

def countOutliers(df, prop, q_index_1=.25, q_index_3=.75, bound_radius=1.5):
    Q1 = df[prop].quantile(q_index_1)
    Q3 = df[prop].quantile(q_index_3)
    IQR = Q3 - Q1
    # Define the lower and upper bounds for outliers
    lower_bound = Q1 - bound_radius * IQR
    upper_bound = Q3 + bound_radius * IQR

    outliers = df[(df[prop] < lower_bound) | (df[prop] > upper_bound)]
    return len(outliers)

def junk_filter(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return None


def findRatingDiff(data_list):
    for data in data_list:
        try:
            rating_diff = abs(int(data["title-rating"])-int(data["brainjs-rating"]))
        except:
            rating_diff = -1
        data["rating-diff"] = rating_diff


def csvToList(csv_path):
    df = pd.read_csv(csv_path)
    df.to_dict(orient="records")


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
