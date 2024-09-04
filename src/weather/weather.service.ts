import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WeatherService {
  constructor(private readonly prismaService: PrismaService) {}

  async getWeathers() {
    return this.prismaService.recent_weather.findMany();
  }
}
