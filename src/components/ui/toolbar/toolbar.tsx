import * as React from "react";
import {
    ToolbarButton,
    Avatar,
    Breadcrumb,
    Toolbar as FluentToolbar,
    ToolbarDivider,
    Tooltip,
    Menu,
    MenuTrigger,
    Button,
    Persona,
    MenuPopover,
    MenuList,
    MenuItem,
} from "@fluentui/react-components";
import { AppToolbarProps } from "../types";
import { ICONS } from "../constants";
import { useStyles } from "../use-styles";
import { Breadcrumbs } from "../breadcrumbs/breadcrumbs";
import { ChevronDownRegular } from "@fluentui/react-icons";

export const AppToolbar: React.FC<AppToolbarProps> = ({ isOpen, onToggle, isMobile, isTablet, breadcrumbs, userName, userRole }) => {
    const styles = useStyles();
    const [displayedTooltipContent, setDisplayedTooltipContent] = React.useState("");
    const [isTooltipOpen, setIsTooltipOpen] = React.useState(false); // State to control tooltip visibility

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDisplayedTooltipContent(isOpen ? "Close Navigation" : "Open Navigation");
        }, 300); // Match the CSS transition duration
        return () => clearTimeout(timer);
    }, [isOpen]);


    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
                <FluentToolbar>
                    <Tooltip
                        content={displayedTooltipContent}
                        relationship="description"
                        withArrow
                        visible={isTooltipOpen}
                        onVisibleChange={(_ev, data) => setIsTooltipOpen(data.visible)}
                    >
                        <ToolbarButton
                            appearance="transparent"
                            aria-label={displayedTooltipContent}
                            icon={isOpen ? <ICONS.TOOLBAR.closeSidebar /> : <ICONS.TOOLBAR.openSidebar />}
                            onClick={() => {
                                onToggle(); // Toggle sidebar
                                setIsTooltipOpen(false); // Close tooltip immediately on click
                            }}
                        />
                    </Tooltip>
                    <ToolbarDivider />
                    <Breadcrumb aria-label="Current page navigation">
                        <Breadcrumbs items={breadcrumbs} isMobile={isMobile} />
                    </Breadcrumb>
                </FluentToolbar>
            </div>
            <div className={styles.toolbarRight}>
                <Menu positioning={{ autoSize: true }}>
                    <MenuTrigger disableButtonEnhancement>
                        <Button
                            appearance="transparent"
                            aria-label="User menu"
                            style={{
                                marginRight: isMobile ? '0' : '0',
                                marginLeft: isMobile ? '100px' : '0',
                                padding: isMobile ? '0' : undefined,
                                minWidth: isMobile ? '0' : undefined,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {isMobile ? (
                                    <Avatar name={userName} />
                                ) : (isTablet ? (
                                    <Persona
                                        className={styles.personaName}
                                        name={userName}
                                        secondaryText={userRole}
                                    />
                                ) : (
                                    <Persona
                                        className={styles.personaName}
                                        name={userName}
                                        secondaryText={userRole}
                                    />
                                ))}
                                <ChevronDownRegular style={{ marginLeft: isMobile ? '5px' : '10px' }} />
                            </div>
                        </Button>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Logout</MenuItem>
                            <MenuItem disabled>Statistics</MenuItem>
                        </MenuList>
                    </MenuPopover>
                </Menu>
            </div>
        </div>
    );
};