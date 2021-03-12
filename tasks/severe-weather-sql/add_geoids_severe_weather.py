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

def check_for_state_fips_except_outlying_areas(cursor,conn,fip):
    sql = """
        UPDATE severe_weather.details
        SET geoid = state_fips::TEXT
        WHERE state_fips = """+str(fip)+"""
        """

    cursor.execute(sql)
    conn.commit()

def check_for_state_fips_outlying_areas(cursor,conn,outlying_areas):
    sql = """
            UPDATE severe_weather.details
            SET geoid = """+outlying_areas['actual_fips']+"""
            WHERE state_fips = """+outlying_areas['table_fips']+"""
            """

    cursor.execute(sql)
    conn.commit()

def check_for_county_fips_except_outlying_areas(cursor,conn,fip):
    sql = """
        UPDATE severe_weather.details
        SET geoid = LPAD(state_fips::TEXT, 2, '0') || LPAD(cz_fips::TEXT, 3, '0')
        WHERE state_fips =  """+str(fip)+"""
        AND cz_type IN ('C')
        """
    cursor.execute(sql)
    conn.commit()

def check_for_county_fips_outlying_areas(cursor,conn,outlying_areas):
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
        WHERE state_fips = """+outlying_areas['table_fips']+"""
        AND cz_type IN ('C')
    """
    cursor.execute(sql)
    conn.commit()

def check_for_weather_zone_except_outlying_areas(cursor,conn,fip):

    sql = """
        UPDATE severe_weather.details as a
        SET geoid = b.fips
        FROM severe_weather.zone_to_county as b 
        WHERE lower(a.cz_name) = lower(b.county)
        AND a.state_fips::TEXT= substring(b.fips::TEXT,1,2) 
        and a.state_fips = """ + str(fip) + """
        and cz_type IN ('Z')
    """
    cursor.execute(sql)
    conn.commit()

def check_for_weather_zone_outlying_areas(cursor,conn,outlying_areas):

    sql = """
        UPDATE severe_weather.details as a
        SET geoid = b.fips
        FROM severe_weather.zone_to_county as b 
        WHERE lower(a.cz_name) = lower(b.county)
                AND 
                (
                    CASE 
                            WHEN state_fips = '97' THEN 60::TEXT= substring(b.fips::TEXT,1,2)  
                            WHEN state_fips = '98' THEN 66::TEXT= substring(b.fips::TEXT,1,2) 
                            WHEN state_fips = '96' THEN 78::TEXT= substring(b.fips::TEXT,1,2)
                            WHEN state_fips = '99' THEN 72::TEXT= substring(b.fips::TEXT,1,2)
                    END 
                )
        and state_fips = """+outlying_areas['table_fips']+"""
        and cz_type IN ('Z')
    """
    cursor.execute(sql)
    conn.commit()

def add_cousubs_except_outlying_areas(cursor,conn,fip):
    geo_table_name = 'geo.tl_2017_' + fip + '_cousub'
    sql = """
        UPDATE severe_weather.details
        SET cousub_geoid = (
            SELECT geotl.geoid
            FROM """ + geo_table_name + """ AS geotl
            WHERE ST_Contains(ST_TRANSFORM(geotl.geom,4326),
							  ST_TRANSFORM(severe_weather.details.begin_coords_geom,4326))
        )
    
        WHERE (state_fips = """+str(fip)+""")
        AND begin_coords_geom IS NOT NULL;
        """
    cursor.execute(sql)
    conn.commit()

def add_cousubs_outlying_areas(cursor,conn,outlying_areas):
    geo_table_name = 'geo.tl_2017_' + outlying_areas['actual_fips'] + '_cousub'
    sql = """
        UPDATE severe_weather.details
        SET cousub_geoid = (
            SELECT geotl.geoid
            FROM """ + geo_table_name + """ AS geotl
            WHERE ST_Contains(ST_TRANSFORM(geotl.geom,4326),
							  ST_TRANSFORM(severe_weather.details.begin_coords_geom,4326))
        )
    
        WHERE (state_fips = """ + outlying_areas['table_fips'] + """)
        AND begin_coords_geom IS NOT NULL;
        """
    cursor.execute(sql)
    conn.commit()

def add_tracts_except_outlying_areas(cursor,conn,fip):
    geo_table_name = 'geo.tl_2017_' + fip + '_tract'
    sql = """
        UPDATE severe_weather.details
        SET geoid= (
            SELECT geotl.geoid
            FROM """ + geo_table_name + """ AS geotl    
            WHERE ST_Contains(ST_TRANSFORM(geotl.geom,4326),
							  ST_TRANSFORM(severe_weather.details.begin_coords_geom,4326))
        )
        
        WHERE (state_fips = """ + str(fip) + """)
        AND begin_coords_geom IS NOT NULL;
        """
    cursor.execute(sql)
    conn.commit()

def add_tracts_outlying_areas(cursor,conn,outlying_areas):
    geo_table_name = 'geo.tl_2017_' + outlying_areas['actual_fips'] + '_tract'
    sql = """
        UPDATE severe_weather.details
        SET geoid= (
            SELECT geotl.geoid
            FROM """ + geo_table_name + """ AS geotl    
            WHERE ST_Contains(ST_TRANSFORM(geotl.geom,4326),
							  ST_TRANSFORM(severe_weather.details.begin_coords_geom,4326))
        )
        
        WHERE (state_fips = """ + outlying_areas['table_fips'] + """)
        AND begin_coords_geom IS NOT NULL;
        """
    cursor.execute(sql)
    conn.commit()

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

    fips_data = get_state_fips_code(cursor)
    outlying_fips = ['60','66','78','72']
    outlying_areas = [{'table_fips':'97','actual_fips':'60'},{'table_fips':'98','actual_fips':'66'},{'table_fips':'96','actual_fips':'78'},{'table_fips':'99','actual_fips':'72'}]
    fips_data = filter(lambda x: x['fips'] not in outlying_fips, fips_data)


    for fip in list(fips_data):
        print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH STATE FIPS ...',fip)
        check_for_state_fips_except_outlying_areas(cursor,conn,fip['fips'])
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH STATE FIPS DONE')

    for outlying in outlying_areas:
        print('POPULATING GEOID FOR OUTLYING AREAS IN SEVERE WEATHER TABLE WITH STATE FIPS IN OUTLYING AREAS ...',outlying)
        check_for_state_fips_outlying_areas(cursor,conn,outlying)
    print('POPULATING GEOID FOR OUTLYING AREAS IN SEVERE WEATHER TABLE WITH STATE FIPS DONE')

    for fip in fips_data:
        print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS C ...',fip)
        check_for_county_fips_except_outlying_areas(cursor,conn,fip['fips'])
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS C DONE')

    for outlying in outlying_areas:
        print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS C ...',outlying)
        check_for_county_fips_outlying_areas(cursor,conn,outlying)
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS C DONE')

    for fip in fips_data:
        print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS Z ...',fip)
        check_for_weather_zone_except_outlying_areas(cursor,conn,fip['fips'])
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS Z DONE')

    for outlying in outlying_areas:
        print('POPULATING GEOID FOR OUTLYING AREAS IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS Z ...',outlying)
        check_for_weather_zone_outlying_areas(cursor,conn,outlying)
    print('POPULATING GEOID FOR OUTLYING AREAS IN SEVERE WEATHER TABLE WITH COUNTY GEOIDS WHERE CZ_TYPE IS Z DONE')


    for fip in fips_data:
        print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUSUBS ...',fip)
        add_cousubs_except_outlying_areas(cursor,conn,fip['fips'])
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH COUSUBS DONE')

    for outlying in outlying_areas:
        print('POPULATING GEOID FOR OUTLYING AREAS IN SEVERE WEATHER TABLE WITH COUSUBS ...',outlying)
        add_cousubs_outlying_areas(cursor,conn,outlying)
    print('POPULATING GEOID FOR OUTLYING AREAS IN SEVERE WEATHER TABLE WITH COUSUBS DONE')

    for fip in fips_data:
        print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH TRACTS ...',fip)
        add_tracts_except_outlying_areas(cursor,conn,fip['fips'])
    print('POPULATING GEOID IN SEVERE WEATHER TABLE WITH TRACTS DONE')

    for outlying in outlying_areas:
        print('POPULATING GEOID FOR OUTLYING AREAS IN SEVERE WEATHER TABLE WITH TRACTS ...',outlying)
        add_tracts_outlying_areas(cursor,conn,outlying)
    print('POPULATING GEOID FOR OUTLYING AREAS IN SEVERE WEATHER TABLE WITH TRACTS DONE')


    conn.commit()
    cursor.close()
    conn.close()


# END main

if __name__ == "__main__":
    main()
