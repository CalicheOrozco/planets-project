import { parse } from 'csv-parse';
import * as fs from 'fs'; 

const result = []

const isHabitablePlanet = (planet) => {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}

fs.createReadStream('kepler_data.csv')
    .pipe(parse({ 
        comment: '#',
        columns: true
    }))
    .on('data', (row) => {
        if (isHabitablePlanet(row)) {
            result.push(row);
        }
    })
    .on('error', (err) => {
        console.error(err);
    })
    .on('end', () => {
        console.log(`${result.length} habitable planets found!`);
        console.log(result.map((planet) => {
            let { kepler_name, koi_prad, koi_srad, koi_steff } = planet;
            koi_prad = koi_prad + " Earths"
            koi_srad = koi_srad + " Solar Radii"
            koi_steff =  koi_steff + " K"

            return {
                name: kepler_name,
                radius: koi_prad,
                distance: koi_srad,
                temperature: koi_steff
            }
        }));
    });





