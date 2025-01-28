import mongoose, { Document, Schema } from "mongoose";

export interface ITenant extends Document {
  name: string;
  email: string;
}

const TenantSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const Tenant = mongoose.model<ITenant>("Tenant", TenantSchema);

export default Tenant;

