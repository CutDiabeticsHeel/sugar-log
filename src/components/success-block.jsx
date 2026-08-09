import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import style from "../css/components/success-block.module.css";

function SuccessBlock({ show, operation }) {
    return createPortal(
        <AnimatePresence>
            {show && (
                <motion.div
                    className={style.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
                    transition={{ duration: 1.0 }}
                >
                    <div className={style.successBlock}>
                        <span className={style.successText}>{operation}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default SuccessBlock;