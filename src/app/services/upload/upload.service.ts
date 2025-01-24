import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  uploadImage(file: any) {
    const contentType = file.type;
    const bucket = new S3({
      accessKeyId: 'AKIAXIAMAZUGCY6N7BNH',
      secretAccessKey: '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',
      //region: 'me-south-1'
      region: 'us-east-1'
    });
    const fileName = 'images/' + file.name;
    const params = {
      //Bucket: 'ifamygate-floatingcity',
      Bucket: 'ifaoryx',
      Key: fileName,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    bucket.upload(params, function(err: any, data: any){
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });
    //for upload progress   
    /*bucket.upload(params).on('httpUploadProgress', function (evt) {
        console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
      }).send(function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });*/
  }

  uploadDoc(file: any) {
    const contentType = file.type;
    const bucket = new S3({
      accessKeyId: 'AKIAXIAMAZUGCY6N7BNH',
      secretAccessKey: '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',
      region: 'me-south-1'
    });
    const fileName = 'documents/' + file.name;
    const params = {
      Bucket: 'ifamygate-floatingcity',
      Key: fileName,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    bucket.upload(params, function(err: any, data: any){
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });
    //for upload progress   
    /*bucket.upload(params).on('httpUploadProgress', function (evt) {
        console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
      }).send(function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });*/
  }
}
