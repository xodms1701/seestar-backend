import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, retry } from 'rxjs';
import { AxiosError } from 'axios';
import { Prisma } from '@prisma/client';

@Injectable()
export class BatchService {
  private readonly appid: string;

  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.appid = this.configService.get<string>('OPEN_WEATHER_API_KEY');
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async batchWeather() {
    console.log('batchWeather 실행');
    const locations = await this.prisma.location.findMany();

    const weathers: Prisma.weatherCreateManyInput[] = [];

    for (const location of locations) {
      const params: ParamsGetCurrentWeatherDto = {
        appid: this.appid,
        lat: location.latitude,
        lon: location.longitude,
        units: 'metric',
      };

      const { data } = await firstValueFrom(
        this.httpService
          .get<ResponseGetCurrentWeatherDto>(
            'https://api.openweathermap.org/data/2.5/weather',
            {
              params,
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              console.error(error);
              throw 'An error happened!';
            }),
            retry(5),
          ),
      );

      const type = data.weather[0].id;
      const icon = data.weather[0].icon;

      weathers.push({
        location_id: location.id,
        visibility: data.visibility,
        clouds: data.clouds.all,
        humidity: data.main.humidity,
        rain: data.rain ? data.rain['1h'] : null,
        calc_at: new Date(data.dt * 1000),
        type: type,
        icon: icon,
        temp: data.main.temp,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
      });
    }

    await this.prisma.weather.createMany({ data: weathers });

    console.log('batchWeather 실행 완료');
  }
}
