const express = require('express')
const app = express()
const cron = require('node-cron');
const axios = require('axios');
const nodemailer = require('nodemailer');

const websites = [
    'http://omldesign.com/',
    'https://mutalecharles.com',
    'https://tulabi.co',
    'https://nchima.net',
    'https://soniczambia.com'
  ]; 
  const EMAIL_SECURE_CONNECTION = "true";
  const EMAIL_AUTH_USERNAME = "mutalecharles@gmail.com";
  const EMAIL_AUTH_PASSWORD = "aiezcuzolbykxmcs";
  const EMAIL_SERVER_PORT = 465;
  const EMAIL_SERVICE_FROM = "mutalecharles@gmail.com";
  const EMAIL_TRANSPORT_METHOD = "SMTP";
  const EMAIL_SERVER_HOST = "smtp.gmail.com";
  
  const emailConfig = {
    from: EMAIL_SERVICE_FROM,
    host: EMAIL_SERVER_HOST,
    secureConnection: EMAIL_SECURE_CONNECTION,
    port: EMAIL_SERVER_PORT,
    transportMethod: EMAIL_TRANSPORT_METHOD,
    auth: {
      user: EMAIL_AUTH_USERNAME,
      pass: EMAIL_AUTH_PASSWORD,
    }
  };
  
  const sendEmailNotification = async (websiteUrl, nonGenericErrorMessage="") => {
    try {
      const transporter = nodemailer.createTransport(emailConfig);
      const furtherDetails =  nonGenericErrorMessage === ""?"":` Details: \n \n ${nonGenericErrorMessage} \n`
      const mailOptions = {
        from: 'mutalecharles@gmail.com',
        to: 'mutalecharles@gmail.com',
        subject: `Nightowl alert - ${websiteUrl}`,
        text: `Hello, \n \n Nightowl, your website monitoring tool, has detected that the website ${websiteUrl} is currently down or encountered an error. This notification is automatically generated to inform you about the issue. \n ${furtherDetails} \n Please take appropriate action to resolve the issue and restore the website's functionality.\n Best Regards, \n \n Nightowl Monitoring Team `
      };
      await transporter.sendMail(mailOptions);
      console.log(`[${new Date().toISOString()}] Email notification sent for ${websiteUrl}.`);
    } catch (error) {
      console.log(`[${new Date().toISOString()}] Error occurred while sending email notification: ${error.message}`);
    }
  };
  
  const checkWebsiteStatus = async (websiteUrl) => {
    try {
      const response = await axios.get(websiteUrl);
      if (response.status === 200) {
        console.log(`[${new Date().toISOString()}] ${websiteUrl} is live.`);
      } else {
        console.log(`[${new Date().toISOString()}] ${websiteUrl} returned status code ${response.status}.`);
        sendEmailNotification(websiteUrl);
      }
    } catch (error) {
      console.log(`[${new Date().toISOString()}] Error occurred while checking ${websiteUrl}: ${error.message}`);
      sendEmailNotification(websiteUrl,error.message);
    }
  };
  
  cron.schedule('0 0 */12 * * *', async () => { //running every 12 hours
    try {
      const requests = websites.map(websiteUrl => checkWebsiteStatus(websiteUrl));
      await Promise.all(requests);
    } catch (error) {
      console.log(`[${new Date().toISOString()}] Error occurred while checking websites: ${error.message}`);
    }
  });
  
  
  console.log(`
  ██████╗ ███╗   ███╗██╗         ███╗   ██╗██╗ ██████╗ ██╗  ██╗████████╗ ██████╗ ██╗    ██╗██╗     
  ██╔═══██╗████╗ ████║██║         ████╗  ██║██║██╔════╝ ██║  ██║╚══██╔══╝██╔═══██╗██║    ██║██║     
  ██║   ██║██╔████╔██║██║         ██╔██╗ ██║██║██║  ███╗███████║   ██║   ██║   ██║██║ █╗ ██║██║     
  ██║   ██║██║╚██╔╝██║██║         ██║╚██╗██║██║██║   ██║██╔══██║   ██║   ██║   ██║██║███╗██║██║     
  ╚██████╔╝██║ ╚═╝ ██║███████╗    ██║ ╚████║██║╚██████╔╝██║  ██║   ██║   ╚██████╔╝╚███╔███╔╝███████╗
  ╚═════╝ ╚═╝     ╚═╝╚══════╝    ╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚══╝╚══╝ ╚══════╝`);
  console.log(`Open Mind Labs Nightowl v1.0.0`);
  console.log(`Nightowl monitoring service is running`);
  