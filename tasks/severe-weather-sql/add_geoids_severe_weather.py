import os, psycopg2
from os import environ

'''
                  SW      ACTUAL 
American Samoa    97      60
GUAM              98      66
Virgin Islands    96      78
Puerto Rico       99      72 


'''

def get_state_fips_code(cursor):
    print('IN GET STATE FIPS...')
    sql = """
		SELECT statefp,stusps
	FROM geo.tl_2017_us_state
	"""
    cursor.execute(sql)
    fips_data = [{'fips': t[0], 'state_code': t[1]} for t in cursor.fetchall()]
    print('FETCHED STATE FIPS')
    return fips_data


def check_for_state_fips(cursor):
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH STATE FIPS ...')
    fips = get_state_fips_code(cursor)
    for fip in fips:
        sql = """
        UPDATE severe_weather.details
        SET geoid = state_fips::TEXT
        WHERE geoid IS NULL
        AND state_fips = """ + fip["fips"] + """
        """
        cursor.execute(sql)
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH STATE FIPS DONE')


def check_for_county_fips(cursor):
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS NOT Z ...')
    fips = get_state_fips_code(cursor)
    for fip in fips:
        sql = """
        UPDATE severe_weather.details
        SET geoid = LPAD(state_fips::TEXT, 2, '0') || LPAD(cz_fips::TEXT, 3, '0')
        WHERE geoid IS NULL
        AND state_fips = """ + fip["fips"] + """
        AND cz_type IN ('C')
        """
        cursor.execute(sql)
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS NOT Z DONE')

def check_for_weather_zone(cursor):
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS Z ...')
    sql = """
        UPDATE severe_weather.details as a
        SET geoid = b.fips
        FROM severe_weather.zone_to_county as b 
        WHERE lower(a.cz_name) = lower(b.county)
        AND geoid  is null 
        and cz_type IN ('C','Z')
    """
    cursor.execute(sql)
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS Z DONE')

'''
rows where they are outlying areas but the state fips are incorrect in Storm events 
'''
def check_for_weather_zone_outlying_areas(cursor):
    print('POPULATING OUTLYING AREAS GEOID IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS C OR  Z ...')

    sql = """
        UPDATE severe_weather.details as a
        SET geoid = (
			
					CASE 
						WHEN state_fips = '97' THEN LPAD(60::TEXT, 2, '0') || LPAD(cz_fips::TEXT, 3, '0')
						WHEN state_fips = '98' THEN LPAD(66::TEXT, 2, '0') || LPAD(cz_fips::TEXT, 3, '0')
						WHEN state_fips = '96' THEN LPAD(78::TEXT, 2, '0') || LPAD(cz_fips::TEXT, 3, '0')
						WHEN state_fips = '99' THEN LPAD(72::TEXT, 2, '0') || LPAD(cz_fips::TEXT, 3, '0')
					END 
					)
        WHERE geoid is null 
        and cz_type IN ('C','Z')
    """
    cursor.execute(sql)
    print('POPULATING OUTLYING AREAS GEOID IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS C OR  Z DONE')

def add_cousubs(cursor):
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUSUBS ...')
    fips = ["01", "02", "04", "05", "06", "08", "09", "10", "11", "12", "13", "15", "16", "17", "18", "19", "20", "21",
            "22", "23", "24",
            "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42",
            "44", "45", "46",
            "47", "48", "49", "50", "51", "53", "54", "55", "56","60","66","69","72","78"]

    print(len(fips))
    for fip in fips:
        print(fip)
        geo_table_name = 'geo.tl_2017_' + fip + '_cousub'
        sql = """
        
        UPDATE severe_weather.details
        SET cousub_geoid = (
            SELECT geotl.geoid
            FROM """ + geo_table_name + """ AS geotl
            WHERE ST_Contains(ST_TRANSFORM(geotl.geom,4326),
							  ST_TRANSFORM(severe_weather.details.begin_coords_geom,4326))
        )
        WHERE cousub_geoid IS NULL
        AND (state_fips = """ + fip + """)
        AND begin_coords_geom IS NOT NULL;
        """
        cursor.execute(sql)
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUSUBS DONE')

def add_tracts(cursor):
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH TRACTS ...')
    fips = ["01", "02", "04", "05", "06", "08", "09", "10", "11", "12", "13", "15", "16", "17", "18", "19", "20", "21",
            "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
            "40", "41", "42", "44", "45", "46", "47", "48", "49", "50", "51", "53", "54", "55", "56","60","66","69","72","78"]
    print(len(fips))
    for fip in fips:
        print(fip)
        geo_table_name = 'geo.tl_2017_' + fip + '_tract'
        sql = """
        UPDATE severe_weather.details
        SET geoid= (
            SELECT geotl.geoid
            FROM """ + geo_table_name + """ AS geotl    
            WHERE ST_Contains(ST_TRANSFORM(geotl.geom,4326),
							  ST_TRANSFORM(severe_weather.details.begin_coords_geom,4326))
        )
        WHERE geoid IS NULL
        AND (state_fips = """ + fip + """)
        AND begin_coords_geom IS NOT NULL;
        """
        cursor.execute(sql)
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH TRACTS DONE')

def main():
    with open('../../config/postgres.env') as f:
        os.environ.update(
            line.replace('export ', '', 1).strip().split('=', 1) for line in f
            if 'export' in line
        )

    conn = psycopg2.connect(host=environ.get('PGHOST'),
                            database=environ.get('PGDATABASE'),
                            user=environ.get('PGUSER'),
                            port=environ.get('PGPORT'),
                            password=environ.get('PGPASSWORD'))
    cursor = conn.cursor()

    check_for_state_fips(cursor)
    check_for_county_fips(cursor)
    check_for_weather_zone(cursor)
    check_for_weather_zone_outlying_areas(cursor)
    add_cousubs(cursor)
    add_tracts(cursor)


    conn.commit()
    cursor.close()
    conn.close()


# END main

if __name__ == "__main__":
    main()
