import pandas as pd
import os

dir = "./climate"
files = [f for f in os.listdir(dir)]
comb = pd.DataFrame()

years = list(range(2008, 2024))

for i, csv in enumerate(files):
    year = years[i] 
    path = os.path.join(dir, csv)
    data = pd.read_csv(path)
    
    data = data[['Name', 'Value']]  
    data['Year'] = year  
    
    data = data.rename(columns={'Value': str(year)})
    
    if comb.empty:
        comb = data
    else:
        comb = pd.merge(comb, data[['Name', str(year)]], on='Name', how='outer')

comb = comb[['Name'] + [str(year) for year in years]]

comb = comb.rename(columns={'Name': 'County'})

comb.to_csv('comb.csv', index=False)

print("CSV saved.")
