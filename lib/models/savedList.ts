import mongoose, { Document, Model } from "mongoose";

export interface ISavedList extends Document {
  name: string;
  email: string;
  creationDate: Date;
  responseCodes: string[];
  imageUrls: string[];
}

const savedListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  responseCodes: [
    {
      type: String,
      required: true,
    },
  ],
  imageUrls: [
    {
      type: String,
      required: true,
    },
  ],
});

const SavedList: Model<ISavedList> =
  mongoose.models.SavedList || mongoose.model<ISavedList>("SavedList", savedListSchema);

export default SavedList;
