// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportFormatData from '../../../app/middleware/format-data';

declare module 'egg' {
  interface IMiddleware {
    formatData: typeof ExportFormatData;
  }
}
