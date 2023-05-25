import { FastifyPluginCallback } from 'fastify';
import { parse} from 'csv-parse/sync';

const parserFunction= () => {
  const fs = require("fs");
  const data = fs.readFileSync("/Users/connorn/Desktop/fullstack-interview/backend/data/us_sunshine.csv", "utf-8");

  const records: any[] = parse(data, {
    columns: true,
    skip_empty_lines: true
  });

  return records;

}

type returnSun = {
  month: string,
  sunshine_percentage: string,
  city: string,
} 

export const campaignRoutes: FastifyPluginCallback = (
  fastify,
  options,
  done
) => {
  fastify.get('/', (request, reply) => {
    return { message: 'Campaign' };
  });
  fastify.get<{ Querystring: { month: string, city: string } }>('/sunshine', (request, reply) => {
    let data = parserFunction();
    if (request.query.month != null && request.query.city != null) {
      for (const vals of data) {
        if (request.query.city == vals.CITY && request.query.month != null) {
          let value = request.query.month;
          return reply.send({ sunshine_percent: vals[request.query.month] });
        }
      }
    }
    if (request.query.month != null) {
      let returnSunArray: returnSun[] = [];
      for (const vals of data) {
        let month = request.query.month;
        let sunshine_percentage = vals[request.query.month];
        let city = vals['CITY'];
        let sunObject = {
          month: month,
          city: city,
          sunshine_percentage: sunshine_percentage
        };
        returnSunArray.push(sunObject);
        return reply.send({ sunArray: returnSunArray });
      }
    }
    return reply.send('No Response was found');
  });

  fastify.get<{ Querystring: { search: string } }>(
    '/search',
    (request, reply) => {
      if (request.query.amount > 5) {
        reply.send({ amount: request.query.amount });
      } else {
        reply.send({ message: 'empty' });
      }
    }
  );
  
  done();
  
};



function convertToAbbreviatedMonth(month: string): string {
  const monthMap: { [key: string]: string } = {
    Jan: 'JAN',
    Feb: 'FEB',
    Mar: 'MAR',
    Apr: 'APR',
    May: 'MAY',
    Jun: 'JUN',
    Jul: 'JUL',
    Aug: 'AUG',
    Sep: 'SEP',
    Oct: 'OCT',
    Nov: 'NOV',
    Dec: 'DEC',
    January: 'JAN',
    February: 'FEB',
    March: 'MAR',
    April: 'APR',
    June: 'JUN',
    July: 'JUL',
    August: 'AUG',
    September: 'SEP',
    October: 'OCT',
    November: 'NOV',
    December: 'DEC'
  };

  const monthAbbreviation = monthMap[month];
  return monthAbbreviation || month.slice(0, 3).toUpperCase();
}


