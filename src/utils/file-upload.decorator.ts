import { applyDecorators, HttpException, HttpStatus, UnsupportedMediaTypeException, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import {v4 as uuid} from 'uuid';

export function ApiFile(filePath: string='./public') {
    return applyDecorators(
      UseInterceptors(FileInterceptor('file',{
          // storage: diskStorage({
          //     destination: filePath,
          //     filename: (req, file, cb) => {
          //         //const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          //         const extension: string = path.parse(file.originalname).ext;
      
          //         cb(null, `${extension}`)
          //     }
          // })
          storage: diskStorage({
              // Destination storage path details
              destination: (req: any, file: any, cb: any) => {
                  const uploadPath = filePath;
                  // Create folder if doesn't exist
                  if (!existsSync(uploadPath)) {
                      mkdirSync(uploadPath);
                  }
                  cb(null, uploadPath);
              },
              // File modification details
              filename: (req: any, file: any, cb: any) => {
                  // Calling the callback passing the random name generated with the original extension name
                  cb(null, `${uuid()}-${Date.now()}${extname(file.originalname)}`);
              },
          }),
        //   fileFilter: (req: any, file: any, cb: any) => {
        //       if (file.mimetype.includes("pdf")) {
        //           // Allow storage of file
        //           cb(null, true);
        //       } else {
        //           // Reject file
        //           cb(new HttpException(`Unsupported file type "${extname(file.originalname)}". Must be a PDF`, HttpStatus.BAD_REQUEST), false);
        //       }
        //   },
  
      
      })),
    );
  }