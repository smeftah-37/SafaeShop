import { Injectable } from '@nestjs/common';
import QRCode from 'qrcode';

@Injectable()
export class QRCodeService {
  async generateQRCode(reservationId: number): Promise<string> {
    const reservationUrl = `https://yourdomain.com/reservation/${reservationId}`;
    return await QRCode.toDataURL(reservationUrl); // Returns a Base64 encoded image
  }
}
