import { FastifyPluginCallback } from 'fastify';
import { parse } from 'csv-parse/sync';

const ANN = 'ANN';

const parserFunction = () => {
  const fs = require('fs');
  const path = require('path');
  const data = fs.readFileSync(
    path.join(__dirname, '../data/us_sunshine.csv'),
    'utf-8'
  );

  const records: any[] = parse(data, {
    columns: true,
    skip_empty_lines: true,
  });

  return records;
};

const parserTopCities = () => {
  const fs = require('fs');
  const path = require('path');
  const data = fs.readFileSync(
    path.join(__dirname, '../data/us-cities-top-1k.csv'),
    'utf-8'
  );

  const records: any[] = parse(data, {
    columns: true,
    skip_empty_lines: true,
  });

  return records;
};

type returnSun = {
  month: string;
  sunshine_percentage: string;
  city: string;
  population?: string;
  long?: string;
  lat?: string;
};

export const campaignRoutes: FastifyPluginCallback = (
  fastify,
  options,
  done
) => {
  fastify.get('/', (request, reply) => {
    return { message: 'Campaign' };
  });
  fastify.get<{ Querystring: { month: string; city: string } }>(
    '/sunshine',
    (request, reply) => {
      let data = parserFunction();
      let month = request.query.month;

      if (request.query.month != null && request.query.city != null) {
        for (const vals of data) {
          const cityQueryEvaluated = cityEvaluation(request.query.city);
          if (cityQueryEvaluated == vals.CITY) {
            const sunshineData = createSunshineObject(
              vals,
              request.query.month,
              request.query.city
            );
            return reply.send({ sunArray: [sunshineData] });
          }
        }
      }
      if (request.query.month != null) {
        let returnSunArray: returnSun[] = [];
        for (const vals of data) {
          const sunshineData = createSunshineObject(
            vals,
            request.query.month,
            vals.CITY
          );
          returnSunArray.push(sunshineData);
        }
        return reply.send({ sunArray: returnSunArray });
      }

      if (request.query.city != null) {
        let returnSunArray: returnSun[] = [];
        for (const vals of data) {
          const sunshineData = createSunshineObject(
            vals,
            ALL,
            request.query.city
          );
          returnSunArray.push(sunshineData);
        }
        return reply.send({ sunArray: returnSunArray });
      }

      return reply.send('No Response was found');
    }
  );

  const createSunshineObject = (dataArr: any, month: string, city: string) => {
    const cityQuery = city;
    const cityQueryEvaluated = cityEvaluation(cityQuery);
    const cityAdditionalData = getAdditionalData(cityQueryEvaluated);

    let sunshine_percentage = '';

    if (month == ALL) {
      sunshine_percentage = dataArr['ANN'];
    } else {
      sunshine_percentage = dataArr[month.toLocaleUpperCase()];
    }

    let sunObject: returnSun = {
      month: '',
      sunshine_percentage: '',
      city: '',
    };

    if (cityAdditionalData != undefined) {
      sunObject = {
        month: month,
        city: cityAdditionalData.City,
        sunshine_percentage: sunshine_percentage,
        population: cityAdditionalData.Population,
        long: cityAdditionalData.lon,
        lat: cityAdditionalData.lat,
      };
    } else {
      sunObject = {
        month: month,
        city: cityQueryEvaluated,
        sunshine_percentage: sunshine_percentage,
      };
    }
    return sunObject;
  };
  const stateAbbreviations = {
    AL: 'Alabama',
    AK: 'Alaska',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming',
  };

  const getAdditionalData = (stateInfo: string): any | undefined => {
    //split stateInfo
    const localData: string[] = stateInfo.split(',');
    let localCity: string = '';
    let fullStateName = '';
    let state = '';
    if (localData.length > 1) {
      localCity = localData[0];
      state = localData[1];
      fullStateName =
        stateAbbreviations[state as keyof typeof stateAbbreviations];
    }

    const topCities = parserTopCities();
    //City,State,Population,lat,lon
    //Marysville,Washington,63269,48.0517637,-122.1770818
    for (const city of topCities) {
      const cityName: string = city.City;
      const stateName: string = city.State;
      if (
        cityName.toLocaleUpperCase() == localCity.toLocaleUpperCase() &&
        fullStateName.toLocaleUpperCase() == stateName.toLocaleUpperCase()
      ) {
        console.log(city);
        return city;
      }
    }
    return undefined;
  };
  /*
  Include population, state, longitude, and latitude in the data returned from sunshine api. For the data, use `/backend/data/us-cities-top-1k.csv`
  */
  fastify.get<{ Querystring: { searchTerm: string } }>(
    '/search',
    (request, reply) => {
      const checkMonth = convertToAbbreviatedMonth(request.query.searchTerm);
      if (checkMonth == '') {
        const cityData = cityEvaluation(request.query.searchTerm);

        if (cityData == undefined) {
          return reply.send('No Response was found');
        }
        return reply.redirect(`sunshine?city=${cityData}`);
      } else {
        // Redirect to '/sunshine' route with the desired query parameters
        const month = checkMonth; // Assuming checkMonth is the desired month
        return reply.redirect(`sunshine?month=${month}`);
      }
    }
  );

  done();
};

function convertToAbbreviatedMonth(month: string): string {
  let monthUpper = month.toLocaleUpperCase();
  const monthMap: { [key: string]: string } = {
    JAN: 'JAN',
    FEB: 'FEB',
    MAR: 'MAR',
    APR: 'APR',
    MAY: 'MAY',
    JUN: 'JUN',
    JUL: 'JUL',
    AUG: 'AUG',
    SEP: 'SEP',
    OCT: 'OCT',
    NOV: 'NOV',
    DEC: 'DEC',
    JANUARY: 'JAN',
    FEBRUARY: 'FEB',
    MARCH: 'MAR',
    APRIL: 'APR',
    JUNE: 'JUN',
    JULY: 'JUL',
    AUGUST: 'AUG',
    SEPTEMBER: 'SEP',
    OCTOBER: 'OCT',
    NOVEMBER: 'NOV',
    DECEMBER: 'DEC',
  };

  const monthAbbreviation = monthMap[monthUpper];
  return monthAbbreviation || '';
}
function cityEvaluation(cityName: string): string {
  const parseData = parserFunction();

  // Creates a map for city evaluation
  let cityArray: Map<string, string> = new Map();
  for (const values of parseData) {
    const fullcityObjectName: string = values.CITY;
    const cityKey: string[] = fullcityObjectName.split(',');
    if (cityKey.length > 1) {
      cityArray.set(cityKey[0], fullcityObjectName);
    } else {
      cityArray.set(fullcityObjectName, fullcityObjectName);
    }
  }

  const incomingCityNameString = cityName.split(',');
  const localCityName = incomingCityNameString[0];
  const rtCityEvaluation = cityArray.get(localCityName.toLocaleUpperCase());

  //Parser for the search engine  if you type in birmingham or birmigham,al
  // it'll return BIRMIGHAM,AL either way
  return rtCityEvaluation || '';
}
