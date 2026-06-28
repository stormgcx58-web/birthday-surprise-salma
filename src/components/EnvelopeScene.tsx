import { motion } from "framer-motion";

interface Props {
  onOpen: () => void;
}

export default function EnvelopeScene({ onOpen }: Props) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3d1278_0%,#1a0035_45%,#090012_100%)]" />

        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-500/20 blur-[120px]"
          animate={{ x: [-20, 30, -20], y: [-10, 20, -10] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[150px]"
          animate={{ x: [20, -20, 20], y: [10, -15, 10] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

      </div>

      <div className="relative z-10 flex flex-col items-center">

        <motion.h2
          className="text-purple-300 text-2xl mb-8 font-bold tracking-wider"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          A Letter For You 💜
        </motion.h2>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative cursor-pointer"
          onClick={onOpen}
        >
          <div
            className="
              relative
              w-72
              h-44
              overflow-hidden
              rounded-b-2xl
              border
              border-purple-200/40
              shadow-[0_25px_60px_rgba(0,0,0,.45)]
              backdrop-blur-sm
            "
            style={{
              background: 'linear-gradient(to bottom, #c4b5fd, #a855f7)',
            }}
          >

            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{ clipPath: "polygon(0 0,50% 55%,100% 0)" }}
            >
              <div className="w-full h-full bg-violet-400" />
            </div>

            <div
              className="absolute bottom-0 left-0 w-full h-full"
              style={{ clipPath: "polygon(0 100%,50% 45%,100% 100%)" }}
            >
              <div className="w-full h-full bg-purple-300" />
            </div>

            <motion.div
              className="absolute left-1/2 -translate-x-1/2 bottom-3 w-56 h-32 bg-white rounded-md shadow-lg flex items-center justify-center text-4xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💜
            </motion.div>

          </div>
        </motion.div>

        <motion.p
          className="text-white/70 mt-8"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tap the envelope to open 💜
        </motion.p>

      </div>
    </motion.div>
  );
}