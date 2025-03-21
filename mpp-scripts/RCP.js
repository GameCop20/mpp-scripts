// ==UserScript==
// @name         ПКК - Панель контроля комнаты - от GameCop20
// @name:en      RCP - Room Control Panel - by GameCop20
// @version      0.1.0
// @devversion   0.6.0
// @description  Панель контроля комнаты, созданная для более удобного контроля комнат. За основу взят скрипт КПМ - Настраиваемые кнопки MPP от gtnntg
// @description:en Room Control Panel, created for more comfort controlling in room. The original script is CMB - Custom MPP Buttons - by gtnntg
// @author       gtnntg
// @remixauthor  GameCop20
// @license      MIT
// @namespace    https://vscode.dev/?connectTo=tampermonkey
// @match        *://multiplayerpiano.org/*
// @match        *://multiplayerpiano.net/*
// @match        *://piano.ourworldofpixels.com/*
// @match        *://playground-mpp.hyye.tk/*
// @match        *://rgbmpp.qwerty0301.repl.co/*
// @match        *://mpp.hyye.tk/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
/* globals MPP */

/*---------[Author info]-------------
 [Discord: gtnntg]
 [E-Mail: developer.georgiyshvedov@mail.ru]
 [GitHub: https://github.com/gtnntg2009]
--------------------------------------*/
/*---------[Remix Author info]-------------
 [Discord: gamecop20]
 [E-Mail: MatvijPC@outlook.com]
 [GitHub: https://github.com/GameCop20]
--------------------------------------*/
/*---------[RU:info]------------
настоящая версия скрипта: 0.6.0

Лицензия и авторское право:
Copyright (C) 2024  Georgiy Shvedov (developer.georgiyshvedov@mail.ru)

Эта программа является свободным программным обеспечением: вы можете распространять ее и/или модифицировать
ее в соответствии с условиями MIT License.

Эта программа распространяется в надежде, что она будет полезной,
но БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ; даже без подразумеваемой гарантии
ТОВАРНОГО ВИДА или ПРИГОДНОСТИ ДЛЯ ОПРЕДЕЛЕННЫХ ЦЕЛЕЙ. См.
MIT License для получения более подробных сведений.

Вы должны были получить копию MIT License
вместе с этой программой. Если нет, см.
<https://opensource.org/licenses/MIT>.
-----------------------------*/

/*---------[EN:info]------------
Current script version: 0.6.0

License and Copyright:
Copyright (C) 2024 Georgiy Shvedov (developer.georgiyshvedov@mail.ru)

This program is free software: you can redistribute it and/or modify
it under the terms of the MIT License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
MIT License for more details.

You should have received a copy of the MIT License
along with this program. If not, see <https://opensource.org/licenses/MIT>.
-----------------------------*/

//-------script-----------
(function() {
    'use strict';

    // CSS для панелей и кнопок
    const CSS = `
    :root {
        --panel-bg-color: rgba(255, 255, 255, 0.9);
        --panel-header-color: rgba(51, 51, 51, 0.9);
        --panel-header-text-color: #ffffff;
        --button-bg-color: rgba(0, 123, 255, 0.9);
        --button-text-color: #ffffff;
        --category-bg-color: rgba(255, 255, 255, 0.5); /* Прозрачный фон для подзаголовков */
        --border-radius: 5px; /* Закругление краев */
    }

    .custom-panel {
        position: fixed;
        top: 20px;
        left: 0;
        width: 250px;
        background-color: var(--panel-bg-color);
        border: 1px solid #ccc;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        display: none;
        overflow: hidden;
        border-radius: var(--border-radius);
    }

    .panel-header {
        background-color: var(--panel-header-color);
        color: var(--panel-header-text-color);
        padding: 10px;
        font-weight: bold;
        cursor: move;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
    }

    .custom-button {
        background-color: var(--button-bg-color);
        color: var(--button-text-color);
        border: none;
        padding: 10px;
        margin: 5px;
        cursor: pointer;
        border-radius: var(--border-radius);
        display: block;
        width: calc(100% - 20px);
        box-sizing: border-box;
    }

    .panel-category {
        background-color: var(--category-bg-color); /* Прозрачный фон */
        padding: 10px;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
        margin-bottom: 5px;
        border-radius: var(--border-radius); /* Закругленные углы */
    }

    .panel-content {
        padding: 10px;
    }

    .slide-panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 300px;
        height: 100%;
        background: var(--panel-bg-color);
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        overflow: hidden;
        z-index: 1001;
        display: flex;
        flex-direction: column;
        border-radius: var(--border-radius);
    }

    .slide-panel.open {
        transform: translateX(0);
    }

    .close-button {
        background: red;
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 10px;
        border-radius: 50%;
        z-index: 1002;
    }

    .toggle-button {
        position: fixed;
        top: 20px;
        left: 20px;
        background: var(--panel-header-color);
        color: var(--panel-header-text-color);
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: var(--border-radius);
        z-index: 1002;
    }

    .style-customizer {
        margin: 20px;
        padding: 10px;
        background: var(--panel-bg-color);
        border: 1px solid #ccc;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        border-radius: var(--border-radius);
    }

    .style-section {
        margin-bottom: 15px;
    }

    .field-container {
        margin-bottom: 10px;
    }

    .field-container label {
        display: block;
        margin-bottom: 5px;
    }

    .field-container input[type="color"],
    .field-container input[type="range"] {
        width: 100%;
    }
    `;

    // Добавление стилей в документ
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = CSS;
    document.head.appendChild(styleSheet);

    // Переменные для настроек стилей
    const DEFAULT_STYLES = {
        panelBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        panelHeaderColor: 'rgba(51, 51, 51, 0.9)',
        panelHeaderTextColor: '#ffffff',
        buttonBackgroundColor: 'rgba(0, 123, 255, 0.9)',
        buttonTextColor: '#ffffff',
        categoryBackgroundColor: 'rgba(255, 255, 255, 0.5)', /* Прозрачный фон для подзаголовков */
        borderRadius: '5px'
    };

    // Проверка активности скрипта
    const SCRIPT_ACTIVE_KEY = 'scriptActive';
    function isScriptActive() {
        return GM_getValue(SCRIPT_ACTIVE_KEY, true);
    }

    // Функция для активации/деактивации скрипта
    function setScriptActive(state) {
        GM_setValue(SCRIPT_ACTIVE_KEY, state);
        if (state) {
            showPanels();
            createSlidePanel();
        } else {
            hidePanels();
        }
    }

    // Получение и сохранение стилей
    function getStyles() {
        return GM_getValue('panelStyles', DEFAULT_STYLES);
    }

    function setStyles(styles) {
        GM_setValue('panelStyles', styles);
        applyStyles();
    }

    // Применение стилей
    function applyStyles() {
        const styles = getStyles();
        document.documentElement.style.setProperty('--panel-bg-color', styles.panelBackgroundColor);
        document.documentElement.style.setProperty('--panel-header-color', styles.panelHeaderColor);
        document.documentElement.style.setProperty('--panel-header-text-color', styles.panelHeaderTextColor);
        document.documentElement.style.setProperty('--button-bg-color', styles.buttonBackgroundColor);
        document.documentElement.style.setProperty('--button-text-color', styles.buttonTextColor);
        document.documentElement.style.setProperty('--category-bg-color', styles.categoryBackgroundColor); /* Прозрачный фон для подзаголовков */
        document.documentElement.style.setProperty('--border-radius', styles.borderRadius);
    }

    // Создание панели
    function createPanel(title, id, categories) {
        const panel = document.createElement('div');
        panel.id = id;
        panel.className = 'custom-panel';

        const header = document.createElement('div');
        header.className = 'panel-header';
        header.textContent = title;
        panel.appendChild(header);

        // Создание контента для панелей
        const panelContent = document.createElement('div');
        panelContent.className = 'panel-content';
        categories.forEach(category => {
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'panel-category';
            categoryHeader.textContent = category.title;
            panelContent.appendChild(categoryHeader);

            category.buttons.forEach(button => {
                const btn = createButton(button.text, button.action);
                panelContent.appendChild(btn);
            });
        });

        panel.appendChild(panelContent);
        document.body.appendChild(panel);
        makeElementDraggable(panel, header);

        return panel;
    }

    // Функция для создания кнопок
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'custom-button';
        button.onclick = onClick;
        return button;
    }

    // Создание и отображение панелей
    function showPanels() {
        const panelsConfig = [
            {
                title: 'Room Settings Control (Part 1)',
                id: 'custom-panel-1',
                categories: [
                    {
                        title: 'Room Access',
                        buttons: [
                            {
                                text: 'On',
                                action: () => {
                                    console.log(`Attempting to enable room access...`);
                                    if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                        if (!MPP.client.desiredChannelSettings.visible) {
                                            console.log(`Currently room access is disabled. Trying to enable room access...`);
                                            setTimeout(() => {
                                                MPP.client.sendArray([{
                                                    m: 'chset',
                                                    set: { visible: true }
                                                }]);
                                                console.log(`Successfully enabled room access.`);
                                            }, 5000);
                                        } else {
                                            console.error(`Error: Room Access is already enabled.`);
                                        }
                                    } else {
                                        console.error(`Error: Unable to enable room access. You don't have permission.`);
                                    }
                                }
                            },
                            {
                                text: 'Off',
                                action: () => {
                                    console.log(`Attempting to disable room access...`);
                                    if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                        if (MPP.client.desiredChannelSettings.visible) {
                                            console.log(`Currently room access is enabled. Trying to disable room access...`);
                                            setTimeout(() => {
                                                MPP.client.sendArray([{
                                                    m: 'chset',
                                                    set: { visible: false }
                                                }]);
                                                console.log(`Successfully disabled room access.`);
                                            }, 5000);
                                        } else {
                                            console.error(`Error: Room Access is already disabled.`);
                                        }
                                    } else {
                                        console.error(`Error: Unable to disable room access. You don't have permission.`);
                                    }
                                }
                            },
                            {
                                text: 'Temporarily On',
                                action: () => {
                                    let minutes = prompt('Enter duration in minutes to enable access:');
                                    if (!isNaN(minutes) && minutes > 0) {
                                        console.log(`Enabling room access for ${minutes} minutes...`);
                                        if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                            MPP.client.sendArray([{
                                                m: 'chset',
                                                set: { visible: true }
                                            }]);
                                            setTimeout(() => {
                                                MPP.client.sendArray([{
                                                    m: 'chset',
                                                    set: { visible: false }
                                                }]);
                                                console.log('Room access disabled after temporary period.');
                                            }, minutes * 60000);
                                        } else {
                                            console.error('Error: You do not have permission to enable temporary access.');
                                        }
                                    } else {
                                        console.error('Invalid input. Please enter a positive number.');
                                    }
                                }
                            },
                            {
                                text: 'Temporarily Off',
                                action: () => {
                                    let minutes = prompt('Enter duration in minutes to disable access:');
                                    if (!isNaN(minutes) && minutes > 0) {
                                        console.log(`Disabling room access for ${minutes} minutes...`);
                                        if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                            MPP.client.sendArray([{
                                                m: 'chset',
                                                set: { visible: false }
                                            }]);
                                            setTimeout(() => {
                                                MPP.client.sendArray([{
                                                    m: 'chset',
                                                    set: { visible: true }
                                                }]);
                                                console.log('Room access enabled after temporary period.');
                                            }, minutes * 60000);
                                        } else {
                                            console.error('Error: You do not have permission to disable temporary access.');
                                        }
                                    } else {
                                        console.error('Invalid input. Please enter a positive number.');
                                    }
                                }
                            }
                        ]
                    },
                    {
                        title: 'Chat Access',
                        buttons: [
                            { text: 'On', action: () => {
                                console.log(`Attempting to enable chat access...`)
                                if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                    if (!MPP.client.desiredChannelSettings.chat) {
                                        console.log(`Trying to enable chat access...`)
                                        setTimeout(() => {
                                            MPP.client.sendArray([{
                                                m: 'chset',
                                                set: { chat: true }
                                            }])
                                            console.log(`Successfully enabled chat access...`)
                                        }, 5000);
                                    } else {
                                        console.error(`Error: Chat access is already enabled.`)
                                    }
                                } else {
                                    console.error(`Error: Unable to enable chat access. You don't have permission.`)
                                }
                            }},
                            { text: 'Off', action: () => {
                                console.log(`Attempting to disable chat access...`)
                                if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                    if (MPP.client.desiredChannelSettings.chat) {
                                        console.log(`Trying to disable chat access...`)
                                        setTimeout(() => {
                                            MPP.client.sendArray([{
                                                m: 'chset',
                                                set: { chat: false }
                                            }]);
                                            console.log(`Successfully disabled chat access...`)
                                        }, 5000)
                                    } else {
                                        console.error(`Error: Chat access is already disabled.`)
                                    }
                                } else {
                                    console.error(`Error: Unable to disable chat access. You don't have permission.`)
                                }
                            }},
                            { text: 'Temporarily On', action: () => {
                                let minutes = prompt('Enter duration in munutes to enable access:')
                                if (!isNaN(minutes) && minutes > 0) {
                                    console.log(`Enabling chat access for ${minutes} minutes...`);
                                    if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                        MPP.client.sendArray([{
                                            m: 'chset',
                                            set: { chat: true }
                                        }]);
                                        setTimeout(() => {
                                            MPP.client.sendArray([{
                                                m: 'chset',
                                                set: { chat: false }
                                            }]);
                                            console.log(`Chat access disabled after temporary period.`)
                                        }, minutes * 60000);
                                    } else {
                                        console.error(`Error: You do not have permission to enable temporary access.`);
                                    }
                                } else {
                                    console.error(`Invalid input. Please enter a positive number.`)
                                }
                            }},
                            { text: 'Temporarily Off', action: () => {
                                let minutes = prompt(`Enter duration in minutes to disable chat access.`)
                                if (!isNaN(minutes) && minutes > 0) {
                                    console.log(`Disabling chat access for ${minutes} minutes...`);
                                    if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                        MPP.client.sendArray([{
                                            m: 'chset',
                                            set: { chat: false }
                                        }]);
                                        setTimeout(() => {
                                            MPP.client.sendArray([{
                                                m: 'chset',
                                                set: { chat: true }
                                            }]);
                                            console.log(`Chat access enabled after temporary period.`)
                                        }, minutes * 60000);
                                    } else {
                                        console.error('Error: You do not have permission to disable temporary access.')
                                    }
                                } else {
                                    console.error(`Invalid input. Please enter a positive number.`);
                                }
                            }}
                        ]
                    },
                    {
                        title: 'Piano Access',
                        buttons: [
                            {
                                text: 'On',
                                action: () => {
                                    console.log(`Attempting to enable piano access...`)
                                    if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                        if (MPP.client.desiredChannelSettings.crownsolo) {
                                            console.log(`Trying to enable piano access...`)
                                            setTimeout(() => {
                                                MPP.client.sendArray([{
                                                    m: 'chset',
                                                    set: { crownsolo: false }
                                                }]);
                                                console.log(`Successfully enabled piano access.`)
                                            });
                                        } else {
                                            console.error(`Error: Piano access is already enabled.`)
                                        }
                                    } else {
                                        console.error(`Error: Unable to enable piano access. You don't have permission.`)
                                    }
                                }
                            },
                            {
                                text: 'Off',
                                action: () => {
                                    console.log(`Attempting to disable piano access...`)
                                    if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                        if (!MPP.client.desiredChannelSettings.crownsolo) {
                                            console.log(`Trying to disable piano access...`)
                                            setTimeout(() => {
                                                MPP.client.sendArray([{
                                                    m: 'chset',
                                                    set: { crownsolo: true }
                                                }]);
                                                console.log(`Successfully disabled piano access.`)
                                            });
                                        } else {
                                            console.error(`Error: Piano access is already disabled.`)
                                        }
                                    } else {
                                        console.error(`Error: Unable to disable piano access. You don't have permission.`)
                                    }
                                }
                            },
                            {
                                text: 'Temporarily On',
                                action: () => {
                                    let minutes = prompt('Enter duration in minutes to enable piano access.')
                                    if (!isNaN(minutes) && minutes > 0) {
                                        console.log(`Enabling piano access for ${minutes} minutes.`)
                                        if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                            MPP.client.sendArray([{
                                                m: 'chset',
                                                set: { crownsolo: false }
                                            }]);
                                            setTimeout(() => {
                                                MPP.client.sendArray([{
                                                    m: 'chset',
                                                    set: { crownsolo: true }
                                                }]);
                                                console.log(`Piano access disabled after temporary period.`)
                                            }, minutes * 60000)
                                        } else {
                                            console.error(`Error: You do not have permission to enable temporary access.`)
                                        }
                                    } else {
                                        console.error(`Invalid input. Please enter a positive number.`)
                                    }
                                }
                            },
                            {
                                text: 'Temporarily Off',
                                action: () => {
                                    let minutes = prompt('Enter duration in minutes to disable piano access.')
                                    if (!isNaN(minutes) && minutes > 0) {
                                        console.log(`Disabling piano access for ${minutes} minutes.`)
                                        if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                            MPP.client.sendArray([{
                                                m: 'chset',
                                                set: { crownsolo: true }
                                            }]);
                                            setTimeout(() => {
                                                MPP.client.sendArray([{
                                                    m: 'chset',
                                                    set: { crownsolo: false }
                                                }]);
                                                console.log(`Piano access enabled after temporary period.`)
                                            }, minutes * 60000)
                                        } else {
                                            console.error(`Error: You do not have permission to disable temporary access.`)
                                        }
                                    } else {
                                        console.error(`Invalid input. Please enter a positive number.`)
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Room Settings Control (Part 2)',
                id: 'custom-panel-2',
                categories: [
                    {
                        title: 'Room Access for bots',
                        buttons: [
                            {
                                text: 'On',
                                action: () => {
                                    console.log(`Attempting to enable room access for bots.`)
                                    if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                        if (MPP.client.desiredChannelSettings.noindex) {
                                            console.log(`Trying to enable room access for bots.`)
                                            setTimeout(() => {
                                                MPP.client.sendArray([{ m: 'chset', set: { noindex: false } }]);
                                                console.log(`Room access for bots successfully enabled.`)
                                            }, 5000)
                                        } else {
                                            console.error(`Error: Room access for bots is already enabled.`)
                                        }
                                    } else {
                                        console.error(`Error: Unable to enable room access for bots. You do not have permission.`)
                                    }
                                }
                            },
                            {
                                text: 'Off',
                                action: () => {
                                    console.log(`Attempting to disable room access for bots.`)
                                    if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                        if (!MPP.client.desiredChannelSettings.noindex) {
                                            console.log(`Trying to disable room access for bots.`)
                                            setTimeout(() => {
                                                MPP.client.sendArray([{ m: 'chset', set: { noindex: true } }]);
                                                console.log(`Room access for bots successfully disabled.`)
                                            }, 5000);
                                        } else {
                                            console.error(`Error: Room access for bots is already disabled.`)
                                        }
                                    } else {
                                        console.error(`Error: Unable to disable room access for bots. You do not have permission.`)
                                    }
                                }
                            }
                        ]
                    },
                    {
                        title: 'Room Limit for all.',
                        buttons: [
                            {
                                text: 'Set Limit',
                                action: () => {
                                    let newLimit = prompt(`Enter new limit to this field.`);
                                    if (newLimit === null) {
                                        console.log('Limit change canceled.');
                                        return;
                                    }

                                    newLimit = parseInt(newLimit);

                                    if (isNaN(newLimit)) {
                                        console.error('Error: Invalid input. Please enter a number.');
                                        return;
                                    }

                                    let currentLimit = MPP.client.desiredChannelSettings.limit;

                                    if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                        if (newLimit < 1 || newLimit > 99) {
                                            console.error(`Error: Unable to set limit. Enter number from 1 to 99.`);
                                        } else {
                                            if (newLimit === currentLimit) {
                                                console.error(`Error: Unable to set limit. Currently limit is ${currentLimit} players!`);
                                            } else {
                                                MPP.client.sendArray([{ m: 'chset', set: { limit: newLimit } }]);
                                                console.log(`Room limit successfully set to ${newLimit}.`);
                                            }
                                        }
                                    } else {
                                        console.error(`Error: Unable to set limit. You do not have permission to set new limit for this room.`);
                                    }
                                }
                            }
                        ]
                    },
                    {
                        title: 'Room Color Settings',
                        buttons: [
                            {
                                text: 'Set Room Color',
                                action: () => {
                                    let innerColor = prompt('Enter inner room color (HEX only):');
                                    let outerColor = prompt('Enter outer room color (HEX only):');

                                    const hexRegex = /^#([0-9A-Fa-f]{6})$/;

                                    if (!hexRegex.test(innerColor) || !hexRegex.test(outerColor)) {
                                        console.error('Error: Invalid HEX color format. Please enter valid HEX codes.');
                                        return;
                                    }

                                    if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                        MPP.client.sendArray([{ m: 'chset', set: { color: innerColor, outline: outerColor } }]);
                                        console.log(`Room colors set to inner: ${innerColor}, outer: ${outerColor}`);
                                    } else {
                                        console.error('Error: You do not have permission to change room colors.');
                                    }
                                }
                            },
                            {
                                text: 'Set Temporary Room Color',
                                action: () => {
                                    let innerColor = prompt('Enter temporary inner room color (HEX only):');
                                    let outerColor = prompt('Enter temporary outer room color (HEX only):');
                                    let duration = prompt('Enter duration in minutes for temporary color change:');

                                    const hexRegex = /^#([0-9A-Fa-f]{6})$/;

                                    if (!hexRegex.test(innerColor) || !hexRegex.test(outerColor) || isNaN(duration) || duration <= 0) {
                                        console.error('Error: Invalid input. Please enter valid HEX codes and duration.');
                                        return;
                                    }

                                    let defaultInnerColor = MPP.client.desiredChannelSettings.color;
                                    let defaultOuterColor = MPP.client.desiredChannelSettings.outline;

                                    if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                        MPP.client.sendArray([{ m: 'chset', set: { color: innerColor, outline: outerColor } }]);
                                        console.log(`Temporary room colors set to inner: ${innerColor}, outer: ${outerColor} for ${duration} minutes.`);

                                        setTimeout(() => {
                                            MPP.client.sendArray([{ m: 'chset', set: { color: defaultInnerColor, outline: defaultOuterColor } }]);
                                            console.log(`Room colors reverted to inner: ${defaultInnerColor}, outer: ${defaultOuterColor}.`);
                                        }, duration * 60000);
                                    } else {
                                        console.error('Error: You do not have permission to set temporary room colors.');
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Room Participants Control',
                id: 'custom-panel-3',
                categories: [
                    {
                        title: 'Moderation & Security',
                        buttons: [
                            {
                                text: 'Ban',
                                action: () => {
                                    let userId = prompt('Enter user ID to ban:');
                                    let duration = prompt('Enter ban duration in minutes (0 for permanent):');

                                    if (userId && duration !== null) {
                                        duration = parseInt(duration);

                                        if (isNaN(duration) || duration < 0) {
                                            console.error('Error: Invalid duration. Please enter a positive number or 0.');
                                            return;
                                        }

                                        if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                            let bannedUsers = JSON.parse(localStorage.getItem('bannedUsers')) || [];
                                            bannedUsers.push({ id: userId, duration: duration });
                                            localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));

                                            MPP.client.sendArray([{
                                                m: 'kickban',
                                                _id: userId,
                                                ms: duration * 60000
                                            }]);
                                            console.log(`User ${userId} banned for ${duration} minutes.`);
                                        } else {
                                            console.error('Error: You do not have permission to ban users.');
                                        }
                                    }
                                }
                            },
                            {
                                text: 'Unban',
                                action: () => {
                                    let userId = prompt('Enter user ID to unban:');

                                    if (userId) {
                                        if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                            let bannedUsers = JSON.parse(localStorage.getItem('bannedUsers')) || [];
                                            bannedUsers = bannedUsers.filter(user => user.id !== userId);
                                            localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));

                                            MPP.client.sendArray([{
                                                m: 'unban',
                                                _id: userId
                                            }]);
                                            console.log(`User ${userId} has been unbanned.`);
                                        } else {
                                            console.error('Error: You do not have permission to unban users.');
                                        }
                                    }
                                }
                            },
                            {
                                text: 'Kick',
                                action: () => {
                                    let userId = prompt('Enter user ID to kick:');

                                    if (userId) {
                                        if (MPP.client.channel.crown && MPP.client.channel.crown.userId === MPP.client.getOwnParticipant()._id) {
                                            MPP.client.sendArray([{
                                                m: 'kickban',
                                                _id: userId,
                                                ms: 0
                                            }]);
                                            console.log(`User ${userId} has been kicked from the room.`);
                                        } else {
                                            console.error('Error: You do not have permission to kick users.');
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            }

        ];

        panelsConfig.forEach(config => {
            const panel = createPanel(config.title, config.id, config.categories);
            panel.style.display = 'block';
        });

        applyStyles();
    }

    // Скрытие панелей
    function hidePanels() {
        const panels = document.querySelectorAll('.custom-panel');
        panels.forEach(panel => panel.style.display = 'none');
    }

    // Функция для создания выдвижной панели
    function createSlidePanel() {
        const slidePanel = document.createElement('div');
        slidePanel.id = 'slide-panel';
        slidePanel.className = 'slide-panel';
        document.body.appendChild(slidePanel);

        const closeButton = document.createElement('button');
        closeButton.id = 'close-slide-panel';
        closeButton.className = 'close-button';
        closeButton.textContent = '✖';
        closeButton.onclick = () => {
            slidePanel.classList.remove('open');
            document.getElementById('toggle-slide-panel').style.display = 'block';
        };
        slidePanel.appendChild(closeButton);

        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-slide-panel';
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = '☰';
        toggleButton.onclick = () => {
            slidePanel.classList.toggle('open');
            toggleButton.style.display = 'none';
            closeButton.style.display = 'block';
        };
        document.body.appendChild(toggleButton);

        const panelButtons = document.createElement('div');
        panelButtons.className = 'panel-buttons';
        slidePanel.appendChild(panelButtons);

        const panel1Button = createButton('Room Settings Control', () => {
            togglePanel('custom-panel-1');
            togglePanel('custom-panel-2');
        }
        );
        const panel2Button = createButton('Room Participants Control', () => togglePanel('custom-panel-3'));
        panelButtons.appendChild(panel1Button);
        panelButtons.appendChild(panel2Button);

        createStyleCustomizer(slidePanel);
    }

    // Функция для переключения видимости панелей
    function togglePanel(panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        }
    }

    // Функция для создания кастомизатора стилей
    function createStyleCustomizer(parentElement) {
        const customizer = document.createElement('div');
        customizer.className = 'style-customizer';
        parentElement.appendChild(customizer);

        const styleSections = [
            { name: 'Panel Background Color', key: 'panelBackgroundColor', type: 'color' },
            { name: 'Panel Header Color', key: 'panelHeaderColor', type: 'color' },
            { name: 'Panel Header Text Color', key: 'panelHeaderTextColor', type: 'color' },
            { name: 'Button Background Color', key: 'buttonBackgroundColor', type: 'color' },
            { name: 'Button Text Color', key: 'buttonTextColor', type: 'color' },
            { name: 'Category Background Color', key: 'categoryBackgroundColor', type: 'color' }, /* Новый параметр */
            { name: 'Border Radius', key: 'borderRadius', type: 'range', min: 0, max: 50, step: 1 }
        ];

        styleSections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'style-section';

            const label = document.createElement('label');
            label.textContent = section.name;
            sectionDiv.appendChild(label);

            const input = document.createElement('input');
            input.type = section.type;
            input.value = getStyles()[section.key];
            if (section.type === 'range') {
                input.min = section.min;
                input.max = section.max;
                input.step = section.step;
            }
            input.onchange = (e) => {
                const newStyles = getStyles();
                newStyles[section.key] = section.type === 'range' ? `${e.target.value}px` : e.target.value;
                setStyles(newStyles);
            };
            sectionDiv.appendChild(input);

            customizer.appendChild(sectionDiv);
        });
    }

    // Функция для перемещения элементов
    function makeElementDraggable(element, handle) {
        handle.onmousedown = function(e) {
            e.preventDefault();
            let shiftX = e.clientX - element.getBoundingClientRect().left;
            let shiftY = e.clientY - element.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                element.style.left = pageX - shiftX + 'px';
                element.style.top = pageY - shiftY + 'px';
            }

            moveAt(e.pageX, e.pageY);

            function onMouseMove(e) {
                moveAt(e.pageX, e.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            handle.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                handle.onmouseup = null;
            };
        };

        handle.ondragstart = function() {
            return false;
        };
    }

    // Запуск скрипта
    setScriptActive(isScriptActive());
})();