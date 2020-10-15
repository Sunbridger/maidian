// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBury from '../../../app/model/bury';
import ExportBuryluban from '../../../app/model/buryluban';
import ExportIgnore from '../../../app/model/ignore';
import ExportPrefix from '../../../app/model/prefix';
import ExportSend from '../../../app/model/send';

declare module 'egg' {
  interface IModel {
    Bury: ReturnType<typeof ExportBury>;
    Buryluban: ReturnType<typeof ExportBuryluban>;
    Ignore: ReturnType<typeof ExportIgnore>;
    Prefix: ReturnType<typeof ExportPrefix>;
    Send: ReturnType<typeof ExportSend>;
  }
}
