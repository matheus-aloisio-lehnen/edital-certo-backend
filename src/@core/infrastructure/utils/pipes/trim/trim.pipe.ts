import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
    private isObj(obj: any) {
        return typeof obj === 'object' && obj !== null;
    }

    private trim(value: any): any {
        if (typeof value === 'string')
            return value.trim();

        if (Array.isArray(value))
            return value.map(v => this.trim(v));

        if (this.isObj(value))
            Object.keys(value).forEach(key => value[ key ] = this.trim(value[ key ]));

        return value;
    }

    transform(value: any, metadata: ArgumentMetadata) {
        return metadata.type === 'body'
            ? this.trim(value)
            : value;
    }

}