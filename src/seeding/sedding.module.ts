import { SeddingService } from './sedding.service';
import { SeddingControllerProtected } from './sedding.controller';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [SeddingControllerProtected],
    providers: [SeddingService, ],
})
export class SeddingModule { }
