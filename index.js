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
            planet.koi_prad = planet.koi_prad + " Earths"
            planet.koi_srad = planet.koi_srad + " Solar Radii"
            planet.koi_steff =  planet.koi_steff + " K"

            return {
                name: planet.kepler_name,
                radius: planet.koi_prad,
                distance: planet.koi_srad,
                temperature: planet.koi_steff
            }
        }));
    });





