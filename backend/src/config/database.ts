import mongoose  from "mongoose";

export const connectDB = async():Promise<void> =>{
     try {
          const mongoUri = process.env.MONGO_URI;
          if (!mongoUri){
               throw new Error('MONGO_URI is not defined');
          }
          await mongoose.connect(mongoUri)
     } catch (error) {;
          console.error('DATABASE CONNECTION FAILED:',error);
          process.exit(1);
     }
}
