"use Client";
import { IVehicle } from "@/models/vehicle.model";
import { ImagePlus, IndianRupee } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
type PropsType = {
  open: boolean;
  onClose: () => void;
  data: IVehicle | null;
};

function PricingModel({ open, onClose, data }: PropsType) {
  const [image, setImage] = useState<File | null>();
  const [preview, setPreview] = useState<string | null>(null);
  const [baseFare, setBaseFare] = useState("");
  const [pricePerKM, setPricePerKM] = useState("");
  const [waitingCharge, setWaitingCharge] = useState("");
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Pricing & Vehicle Image</h2>
            </div>

            <div className="p-6 space-y-6">
              <label
                htmlFor="imageLabel"
                className="relative h-56 rounded-2xl overflow-hidden border-2 border-dashed bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                {!preview ? (
                  <ImagePlus size={30} />
                ) : (
                  <>
                    <img
                      src={preview}
                      alt="preview"
                      className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
                    />

                    <img
                      src={preview}
                      alt="preview"
                      className="relative z-10 max-w-full max-h-full object-contain"
                    />
                  </>
                )}

                <input
                  id="imageLabel"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setImage(e.target.files[0]);
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </label>

              <div>
                <p className="text-sm font-semibold mb-1">Base Fare</p>
                <div className="flex items-center gap-2 border rounded-xl px-4 py-3 bg-white">
                    <IndianRupee size={18}/>
                    <input type="text" placeholder="BaseFare..." value={baseFare} onChange={(e)=>setBaseFare(e.target.value)} className="w-full outline-none"/>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Price Per KM</p>
                <div className="flex items-center gap-2 border rounded-xl px-4 py-3 bg-white">
                    <IndianRupee size={18}/>
                    <input type="text" placeholder="pricePerKM..." value={pricePerKM} onChange={(e)=>setPricePerKM(e.target.value)} className="w-full outline-none"/>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Waiting Charge</p>
                <div className="flex items-center gap-2 border rounded-xl px-4 py-3 bg-white">
                    <IndianRupee size={18}/>
                    <input type="text" placeholder="waitingCharge..." value={waitingCharge} onChange={(e)=>setWaitingCharge(e.target.value)} className="w-full outline-none"/>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
                <button onClick={onClose} className="flex-1 border rounded-xl py-2">Cancel</button>
                <button className="flex-1 bg-black text-white rounded-xl py-2">Save</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PricingModel;
