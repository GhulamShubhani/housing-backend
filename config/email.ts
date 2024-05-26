import nodemailer from 'nodemailer';


  const transporter = nodemailer.createTransport({
    host: 'mxslurp.click',
    port: 2525,
    secure: false,
    auth: {
        user: 'gsBuWJYbLfmrHcCuaboLPD3UZhF7NAn0',
        pass: 'EHr7cwLo68IYAS3FKt8csK5oFOTLPDr3'
    }
});

interface mailOptions {
    to:string;
    subject:string;
    html:string;
}


export const sendMail =async({to,subject,html}:mailOptions)=>{
    const mailOption = {
        from:'gsBuWJYbLfmrHcCuaboLPD3UZhF7NAn0',
        to,
        subject,
        html,
    }

    try {
        console.log(mailOption);
        
       await  transporter.sendMail(mailOption)
       console.log('send successfull');
       
    } catch (error:any) {
        console.log(error?.message);
        
    }
}