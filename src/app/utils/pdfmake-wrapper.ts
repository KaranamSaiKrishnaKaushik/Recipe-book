import * as _pdfMake from 'pdfmake/build/pdfmake';
import * as _pdfFonts from 'pdfmake/build/vfs_fonts';

const pdfMake: typeof _pdfMake = (_pdfMake as any).default || _pdfMake;
pdfMake.vfs = _pdfFonts.vfs;

export default pdfMake;
