import * as React from "react";
import { ContentAreaProps } from "../types";
import { useStyles } from "../use-styles";

export const ContentArea: React.FC<ContentAreaProps> = ({ isMobile, children }) => {
    const styles = useStyles();
    return (
        <div className={styles.content}>
            <div className={`${styles.contentWrapper} ${isMobile ? styles.contentWrapperMobile : ''}`}>
                {children}
            </div>
        </div>
    );
};