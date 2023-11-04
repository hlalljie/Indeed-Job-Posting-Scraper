'''
A program with various data management functions to help clean and prep data for other functions
'''

import pandas as pd
import numpy as np


def main():
    input_file = "Output/large_title_test_1.csv"
    output_file = "test.csv"

    df = pd.read_csv(input_file)

    data_list = df.to_dict(orient="records")
    findRatingDiff(data_list)

    findListPropAndStats(df)


    #print_array(data_list)



def findListPropAndStats(df):
    pd.set_option('display.max_rows', None)
    pd.set_option('display.max_columns', None)
    # Drop rows with NaN values in the "brainjs-rating" column (non-numeric values)
    df['brainjs-rating'] = df['brainjs-rating'].apply(junk_filter)

    # Create a mask to identify rows with NaN in the "brainjs-rating" column
    mask = np.isnan(df['brainjs-rating'])
    # Apply the mask to the DataFrame to retain rows with valid "brainjs-rating" values
    df = df[~mask]
    if not df.empty:
        statistics_df = pd.DataFrame({
            'Mean Rating': [df['title-rating'].mean()],
            'BrainJS Mean Rating': [df['brainjs-rating'].mean()],
            'Median Rating': [df['title-rating'].median()],
            'BrainJS Median Rating': [df['brainjs-rating'].median()],
            'Rating IQR': [df['title-rating'].quantile(0.75) - df['title-rating'].quantile(0.25)],
            'BrainJS IQR': [df['brainjs-rating'].quantile(0.75) - df['brainjs-rating'].quantile(0.25)],
            'Rating Standard Deviation': [df['title-rating'].std()],
            'BrainJS Standard Deviation': [df['brainjs-rating'].std()]
        })
    else:
        # Handle the case where there's no valid data
        statistics_df = pd.DataFrame()
    print(statistics_df)

def junk_filter(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

    '''title_ratings = [item["title-rating"] for item in data_list]
    brainjs_ratings = [item["brainjs-rating"] for item in data_list]
    rating_diffs = [item["rating-diff"] for item in data_list]

    mean_title_rating = findMean(title_ratings)
    mean_brainjs_rating = findMean(brainjs_ratings)
    mean_rating_diff = findMean(rating_diffs)
    print("Mean rating:", mean_title_rating, ", Brainjs Mean: ", mean_brainjs_rating, ", Mean Difference:", mean_rating_diff)

    median_title_rating = findMedian(title_ratings)
    median_brainjs_rating = findMedian(brainjs_ratings)
    median_rating_diff = findMedian(rating_diffs)
    print("Median rating:", median_title_rating[0], ", Brainjs Median: ", median_brainjs_rating[0], ", Median Difference:", median_rating_diff[0])

    #title_rating_iqr = findIQR(data_list, "title-rating", median_title_rating)
    #print("")
def findIQR(data_list, prop, median=None):
    # trim junk data
    clean_data = []
    for data in data_list:
        try:
            clean_data.append(int(data[prop]))
        except:
            pass
    sorted_data = sorted(clean_data)

    if median == None:
        median = findMedian(sorted_data, prop)
    #return IQR
    #check if index is whole number
    if int(median[1]) == median[1]:
        return findMedian(sorted_data[int(median[1])+1:], prop)[0] - findMedian(sorted_data[:int(median[1])], prop)[0]
    else:
        print(sorted_data[int(median[1]) + 1:])
        return findMedian(sorted_data[int(median[1]) + 1:], prop)[0] - findMedian(sorted_data[:int(median[1])+1], prop)[0]





# return the median and the median index of a list
def findMedian(data_list):
    #trim junk data
    clean_data = []
    for data in data_list:
        try:
            clean_data.append(int(data))
        except:
            pass
    sorted_data = sorted(clean_data)
    if len(sorted_data) % 2 == 0:
        return [(sorted_data[len(sorted_data)//2 - 1] + sorted_data[len(sorted_data)//2])/2, len(sorted_data)//2 - .5]
    return [sorted_data[len(sorted_data)//2 - 1]][len(sorted_data)//2 - 1]


def findMean(data_list):
    count = len(data_list)
    data_sum = 0
    for data in data_list:
        try:
            data_sum += int(data)
        except:
            count -= 1
    return data_sum/count

'''
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
