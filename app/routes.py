from app import app
from flask import request
import pandas as pd
from math import sin, cos, sqrt, atan2, radians
import requests
import json
import numpy as np
import os

regionCoordinates = {'Adalar': ['40.8747', '29.1294'],
                     'Arnavutköy': ['41.1864', '28.7389'],
                     'Ataşehir': ['40.9833', '29.1278'],
                     'Avcılar': ['40.9792', '28.7214'],
                     'Bağcılar': ['41.0341', '28.8330'],
                     'Bahçelievler': ['40.9977', '28.8506'],
                     'Bakırköy': ['40.9804', '28.8724'],
                     'Başakşehir': ['41.0837', '28.8169'],
                     'Bayrampaşa': ['41.0349', '28.9122'],
                     'Beşiktaş': ['41.0441', '29.0017'],
                     'Beykoz': ['41.1271', '29.0978'],
                     'Beylikdüzü': ['41.0133', '28.6489'],
                     'Beyoğlu': ['41.0371', '28.9774'],
                     'Büyükçekmece': ['41.0248', '28.5854'],
                     'Çatalca': ['41.1421', '28.4575'],
                     'Çekmeköy': ['41.0323', '29.1695'],
                     'Esenler': ['41.0542', '28.8676'],
                     'Esenyurt': ['41.0412', '28.6939'],
                     'Eyüpsultan': ['41.0551', '28.9346'],
                     'Fatih': ['41.0203', '28.9339'],
                     'Gaziosmanpaşa': ['41.0576', '28.9153'],
                     'Güngören': ['41.0105', '28.8741'],
                     'Kadıköy': ['40.9903', '29.0205'],
                     'Kağıthane': ['41.0717', '28.9646'],
                     'Kartal': ['40.8999', '29.1936'],
                     'Küçükçekmece': ['41.0092', '28.7757'],
                     'Maltepe': ['40.9339', '29.1650'],
                     'Pendik': ['40.8796', '29.2580'],
                     'Sancaktepe': ['41.0090', '29.2109'],
                     'Sarıyer': ['41.1664', '29.0500'],
                     'Silivri': ['41.0737', '28.2479'],
                     'Sultanbeyli': ['40.9684', '29.2620'],
                     'Sultangazi': ['41.1070', '28.8714'],
                     'Şile': ['41.1749', '29.6096'],
                     'Şişli': ['41.0604', '28.9878'],
                     'Tuzla': ['40.8144', '29.3094'],
                     'Ümraniye': ['41.0338', '29.1013'],
                     'Üsküdar': ['41.0327', '29.0319'],
                     'Zeytinburnu': ['40.9910', '28.8968']}

print(os.path.dirname(os.path.abspath(__file__)))
saleData = pd.read_excel(r'./app/satilik.xlsx')
rentData = pd.read_excel(r'./app/kiralik.xlsx')
regionData = pd.read_excel(r'./app/sbolgeRaporu.xlsx')

regionData = regionData.drop([regionData.index[0]])


airPollutionApiKey = ''
fourSquareApi_ClientId = ''
fourSquareApi_ClientSecret = ''
fourSquare_v = ''
with open('./app/data.txt') as json_file:
    data = json.load(json_file)
    print(data)
    fourSquare_v = data['fourSquare_v']
    fourSquareApi_ClientSecret = data['fourSquareApi_ClientSecret']
    fourSquareApi_ClientId = data['fourSquareApi_ClientId']
    airPollutionApiKey = data['airPollutionApiKey']


@app.route('/getData', methods=['POST'])
def getData():
    rentOrSale = request.json['rentOrSale']

    print(request.json['midpoint'])

    print(request.json)

    filteredData = filterData(
        request.json['filters'], request.json['midpoint'], rentOrSale, request.json['rangeOfDistance'])

    print(filteredData.head())

    if (filteredData.empty):
        return 'emptyDataFrame'
    else:
        uniqueRegions = filteredData['Location2'].unique()

        regionAirPollutionData = {'Location2': [], 'airPollution': []}

        for i in uniqueRegions:
            lat = regionCoordinates[i][0]
            lng = regionCoordinates[i][1]
            regionAirPollutionData['Location2'].append(i)
            regionAirPollutionData['airPollution'].append(
                getAirPollutionData(lat, lng))

        regionAirPollutionDf = pd.DataFrame(regionAirPollutionData)

        standartizedData = standartizeData(filteredData, regionAirPollutionDf)
        if (standartizedData.empty):
            return 'emptyDataFrame'
        normalizedData = normalizeData(standartizedData)
        rankedData = rankAlternatives(
            normalizedData, request.json['formValues'])
        if(rankedData.empty):
            return 'emptyDataFrame'

        return rankedData.to_json(orient='records')


def filterData(filters, midpoint, rentOrSale, rangeOfDistance):

    if(rentOrSale == 'sale'):
        filterSaleData = saleData

        flatSizeFiltered = filterSaleData[filterSaleData.OdaSayısı.isin(
            filters['selectedFlatSizes'])]

        if(flatSizeFiltered.empty):
            return flatSizeFiltered

        priceMinimumFiltered = flatSizeFiltered[flatSizeFiltered.Price >
                                                filters['priceRange'][0]]

        if(priceMinimumFiltered.empty):
            return priceMinimumFiltered

        priceMaximumFiltered = priceMinimumFiltered[priceMinimumFiltered.Price <
                                                    filters['priceRange'][1]]

        if(priceMaximumFiltered.empty):
            return priceMaximumFiltered

        distanceToMidpointAdded = priceMaximumFiltered.copy()

        distanceToMidpointAdded['distanceToMidpoint'] = distanceToMidpointAdded.apply(
            lambda row: calculateDistance(midpoint, row['Latitude'], row['Longitude']), axis=1)

        rangeFiltered = distanceToMidpointAdded[distanceToMidpointAdded['distanceToMidpoint'] < rangeOfDistance]

        if(rangeFiltered.empty):
            return rangeFiltered

        return rangeFiltered
    if(rentOrSale == 'rent'):
        filterRentData = rentData

        flatSizeFiltered = filterRentData[filterRentData.OdaSayısı.isin(
            filters['selectedFlatSizes'])]

        if(flatSizeFiltered.empty):
            return flatSizeFiltered

        priceMinimumFiltered = flatSizeFiltered[flatSizeFiltered.Price >
                                                filters['priceRange'][0]]

        if(priceMinimumFiltered.empty):
            return priceMinimumFiltered

        priceMaximumFiltered = priceMinimumFiltered[priceMinimumFiltered.Price <
                                                    filters['priceRange'][1]]

        if(priceMaximumFiltered.empty):
            return priceMaximumFiltered

        distanceToMidpointAdded = priceMaximumFiltered.copy()

        distanceToMidpointAdded['distanceToMidpoint'] = distanceToMidpointAdded.apply(
            lambda row: calculateDistance(midpoint, row['Latitude'], row['Longitude']), axis=1)

        rangeFiltered = distanceToMidpointAdded[distanceToMidpointAdded['distanceToMidpoint'] < rangeOfDistance]

        if(rangeFiltered.empty):
            return rangeFiltered

        return rangeFiltered


def ageOfBuildingSandartize(age):
    if(age == '0'):
        return 6
    if(age == '1'):
        return 5
    if(age == '2'):
        return 5
    if(age == '3'):
        return 5
    if(age == '4'):
        return 5
    if(age == '5'):
        return 5
    if(age == '6-10 arası'):
        return 4
    if(age == '11-15 arası'):
        return 3
    if(age == '16-20 arası'):
        return 2
    if(age == '21-25 arası'):
        return 1


def numberOfRoomsStandartize(numberOfRooms):
    if(numberOfRooms == '1+0 (Stüdyo)'):
        return 1
    else:
        return(eval(numberOfRooms))


def standartizeSocioeconomic(socioeconomicLetterScore):
    if(socioeconomicLetterScore == 'A+'):
        return 4.5
    if(socioeconomicLetterScore == 'A'):
        return 4
    if(socioeconomicLetterScore == 'A-'):
        return 3.5
    if(socioeconomicLetterScore == 'B+'):
        return 3
    if(socioeconomicLetterScore == 'B'):
        return 2.5
    if(socioeconomicLetterScore == 'B-'):
        return 2
    if(socioeconomicLetterScore == 'C+'):
        return 1.5
    if(socioeconomicLetterScore == 'C'):
        return 1
    if(socioeconomicLetterScore == 'C-'):
        return 0.5


def getAirPollutionData(latitude, longitude):

    print('airpollution datasi aliyor')
    URL = 'https://api.breezometer.com/air-quality/v2/current-conditions?lat={}&lon={}&key={}'.format(
        latitude, longitude, airPollutionApiKey)
    r = requests.get(url=URL)
    data = r.json()
    print(data)
    if(data['data']['data_available']):
        return data['data']['indexes']['baqi']['aqi']
    else:
        return 0


def getFourSquareData(lat, lng):
    print('Number of nearby venues:')
    url = 'https://api.foursquare.com/v2/venues/explore'

    params = dict(
        client_id=fourSquareApi_ClientId,
        client_secret=fourSquareApi_ClientSecret,
        v=fourSquare_v,
        ll='{},{}'.format(lat, lng),
        query='',
        limit=1000,
        intent='browse',
        radius=500
    )

    resp = requests.get(url=url, params=params)

    data = json.loads(resp.text)
    print(len(data['response']['groups'][0]['items']))
    return len(data['response']['groups'][0]['items'])


def normalizeReverse(element, sumOf, count):
    countMinusOne = count-1

    return (1-(element/sumOf))/countMinusOne


def normalize(element, sumOf):
    print(element)
    return element/sumOf


def normalizeData(standartizedData):
    normalizedData = standartizedData

    priceSum = normalizedData['Price'].sum(axis=0, skipna=True)
    # print(type(priceSum))
    ageOfBuildingSum = normalizedData['standartizedAgeOfBuilding'].sum(
        axis=0, skipna=True)
    numberOfRoomsSum = normalizedData['standartizedNumberOfRooms'].sum(
        axis=0, skipna=True)
    numberOfBathroomsSum = normalizedData['BanyoSayısı'].sum(
        axis=0, skipna=True)
    # print(type(numberOfRoomsSum))
    sizeSum = normalizedData['Netm2'].sum(axis=0, skipna=True)

    populationSum = normalizedData['Nüfus'].sum(axis=0, skipna=True)
    educationLevelSum = normalizedData['EducationLevel'].sum(
        axis=0, skipna=True)
    socioeconomicSum = normalizedData['standartizedSocioeconomic'].sum(
        axis=0, skipna=True)

    airPollutionSum = normalizedData['airPollution'].sum(axis=0, skipna=True)
    fourSquareSum = normalizedData['fourSquare'].sum(axis=0, skipna=True)

    airPollutionCount = normalizedData['airPollution'].count()
    populationCount = normalizedData['Nüfus'].count()
    priceCount = normalizedData['Price'].count()

    normalizedData['normalizedPrice'] = normalizedData.apply(
        lambda row: normalizeReverse(row['Price'], priceSum, priceCount), axis=1)

    normalizedData['normalizedAgeOfBuilding'] = normalizedData.apply(
        lambda row: normalize(row['standartizedAgeOfBuilding'], ageOfBuildingSum), axis=1)

    normalizedData['normalizedNumberOfRooms'] = normalizedData.apply(
        lambda row: normalize(row['standartizedNumberOfRooms'], numberOfRoomsSum), axis=1)

    normalizedData['normalizedSize'] = normalizedData.apply(
        lambda row: normalize(row['Netm2'], sizeSum), axis=1)

    normalizedData['normalizedNumberOfBathrooms'] = normalizedData.apply(
        lambda row: normalize(row['BanyoSayısı'], numberOfBathroomsSum), axis=1)

    normalizedData['normalizedAirPollution'] = normalizedData.apply(
        lambda row: normalizeReverse(row['airPollution'], airPollutionSum, airPollutionCount), axis=1)

    normalizedData['normalizedFourSquare'] = normalizedData.apply(
        lambda row: normalize(row['fourSquare'], fourSquareSum), axis=1)

    normalizedData['normalizedPopulation'] = normalizedData.apply(
        lambda row: normalizeReverse(row['Nüfus'], populationSum, populationCount), axis=1)

    normalizedData['normalizedEducationLevel'] = normalizedData.apply(
        lambda row: normalize(row['EducationLevel'], educationLevelSum), axis=1)

    normalizedData['normalizedSocioeconomic'] = normalizedData.apply(
        lambda row: normalize(row['standartizedSocioeconomic'], socioeconomicSum), axis=1)

    normalizedData['normalizedBuildingScore'] = normalizedData.apply(lambda row: (
        row['normalizedAgeOfBuilding']+row['normalizedNumberOfRooms']+row['normalizedNumberOfBathrooms']+row['normalizedSize'])/4, axis=1)

    normalizedData['normalizedEnvironmentScore'] = normalizedData.apply(lambda row: (
        row['normalizedPopulation']+row['normalizedEducationLevel']+row['normalizedSocioeconomic']+row['normalizedAirPollution']+row['normalizedFourSquare'])/5, axis=1)

    normalizedData['normalizedEconomicScore'] = normalizedData.apply(
        lambda row: (row['normalizedPrice'])/1, axis=1)

    return normalizedData


def stripName(name):
    return name.strip()


def standartizeData(filteredData, regionAirPollutionDf):
    regionAirPollution = regionAirPollutionDf.copy()
    standartized = filteredData.copy()

    if(standartized.empty):
        return standartized

    standartized['standartizedAgeOfBuilding'] = standartized.apply(
        lambda row: ageOfBuildingSandartize(row['BinaYaşı']), axis=1)

    standartized['standartizedNumberOfRooms'] = standartized.apply(
        lambda row: numberOfRoomsStandartize(row['OdaSayısı']), axis=1)

    # join regionData
    standartized['ilce'] = standartized['Location2']
    standartized = standartized.set_index(
        'Location2').join(regionData.set_index('Location2'))
    standartized = standartized.drop(
        ["Öğrenim Durumu (%)", "Unnamed: 4", "Unnamed: 5", "Unnamed: 6", "Unnamed: 7", "Unnamed: 8"], axis=1)

    if(standartized.empty):
        return standartized

    standartized['standartizedSocioeconomic'] = standartized.apply(
        lambda row: standartizeSocioeconomic(row['Sosyoekonomik']), axis=1)

    standartized = standartized.join(regionAirPollution.set_index('Location2'))

    # standartized['airPollution'] = np.random.randint(
    #   50, 80, standartized.shape[0])

    # standartized['fourSquare'] = np.random.randint(
    #   50, 80, standartized.shape[0])

    standartized['fourSquare'] = standartized.apply(
        lambda row: getFourSquareData(row['Latitude'], row['Longitude']), axis=1)

    return standartized


def rankAlternatives(normalizedData, formValues):
    rankedData = normalizedData.copy()

    rankedData.dropna(subset=['normalizedEconomicScore',
                              'normalizedBuildingScore', 'normalizedEnvironmentScore'], inplace=True)

    if(rankedData.empty):
        return rankedData

    rankedData['ahpScore'] = rankedData.apply(lambda row: formValues['economicAverage']*row['normalizedEconomicScore'] + formValues['buildingAverage']
                                              * row['normalizedBuildingScore']+formValues['environmentAverage']*row['normalizedEnvironmentScore'], axis=1)
    rankedData = rankedData.sort_values(by=['ahpScore'], ascending=False)
    print(rankedData.head())
    return rankedData


def calculateDistance(midpoint, houseLatitude, houseLongitute):

    R = 6373.0  # approximate radius of earth in km

    lat1 = radians(midpoint['latitude'])
    lon1 = radians(midpoint['longitude'])
    lat2 = radians(houseLatitude)
    lon2 = radians(houseLongitute)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c

    return distance
