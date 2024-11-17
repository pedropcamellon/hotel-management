import mongoose, {model} from "mongoose";
import userSchema from "@/schemas/user";

export interface UserDocument {
    _id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

const User = mongoose.models?.User || model<UserDocument>('User', userSchema);

export default User;