import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectDataSource } from '@nestjs/typeorm';
import { Connection, DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

  async systemCheck(): Promise<string> {
    try {      
      const isDbConnected = await this.checkDatabaseConnection();
      if (!isDbConnected) {
        return 'Database connection failed';
      }

      const dbTime = await this.getDatabaseTime();      
      const systemTime = new Date().toISOString();      

      return `System Check Passed:\nDB Time: ${dbTime} OK \nSystem Time: ${systemTime}` ;
    } catch (error) {
      return `System Check Failed: ${error.message}`;
    }
  }

  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

  private async getDatabaseTime(): Promise<string> {
    try {
      const result = await this.dataSource.query('SELECT NOW() AS currentTime');
      console.log('Query Result:', result);  
      return result[0]?.currenttime ? result[0].currenttime.toISOString() : 'No time found';
    } catch (error) {
      return 'Error retrieving DB time';
    }
  }
}
