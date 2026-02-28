/*
--------------------------------------------------

This file is part of PLUCK.
You are free to use these files within your own resources.
Please retain the original credit and attached MIT license.
Support honest development.

Author: Case @ BOII Development
License: https://github.com/boiidevelopment/pluck/blob/main/LICENSE
GitHub: https://github.com/boiidevelopment/pluck

--------------------------------------------------
*/

const SVG_ICONS = { // Icons from here - https://lucide.dev/icons/
    hunger: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.4 13.7A6.5 6.5 0 1 0 6.28 6.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3"/><path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1-2.29 7.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5"/></svg>`,
    thirst: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z"/><path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0"/></svg>`,
    oxygen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>`,
    sanity: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 9a3 3 0 0 0-2.6 1.5L4 9a8 8 0 0 1 16 0l-5.4 1.5A3 3 0 0 0 12 9z"/><path d="M12 15a3 3 0 0 0 2.6-1.5L20 15a8 8 0 0 1-16 0l5.4-1.5A3 3 0 0 0 12 15z"/></svg>`,
    stress: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/></svg>`,
    bleeding: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`,
    radiation: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-radiation-icon lucide-radiation"><path d="M12 12h.01"/><path d="M14 15.4641a4 4 0 0 1-4 0L7.52786 19.74597 A 1 1 0 0 0 7.99303 21.16211 10 10 0 0 0 16.00697 21.16211 1 1 0 0 0 16.47214 19.74597z"/><path d="M16 12a4 4 0 0 0-2-3.464l2.472-4.282a1 1 0 0 1 1.46-.305 10 10 0 0 1 4.006 6.94A1 1 0 0 1 21 12z"/><path d="M8 12a4 4 0 0 1 2-3.464L7.528 4.254a1 1 0 0 0-1.46-.305 10 10 0 0 0-4.006 6.94A1 1 0 0 0 3 12z"/></svg>`,
    infection: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12h.01"/><path d="M14 15.4641a4 4 0 0 1-4 0L7.52786 19.74597 A 1 1 0 0 0 7.99303 21.16211 10 10 0 0 0 16.00697 21.16211 1 1 0 0 0 16.47214 19.74597z"/><path d="M16 12a4 4 0 0 0-2-3.464l2.472-4.282a1 1 0 0 1 1.46-.305 10 10 0 0 1 4.006 6.94A1 1 0 0 1 21 12z"/><path d="M8 12a4 4 0 0 1 2-3.464L7.528 4.254a1 1 0 0 0-1.46-.305 10 10 0 0 0-4.006 6.94A1 1 0 0 0 3 12z"/></svg>`,
    poison: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.5 17-.5-1-.5 1h1z"/><path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="12" r="1"/></svg>`,
    health: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-plus-icon lucide-heart-plus"><path d="m14.479 19.374-.971.939a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.219 1.49"/><path d="M15 15h6"/><path d="M18 12v6"/></svg>`,
    armour: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-icon lucide-shield"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
    temperature: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thermometer-icon lucide-thermometer"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>`,
    voice: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines-icon lucide-audio-lines"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>`
}

const CONDITION_KEYS = ['hunger', 'thirst', 'oxygen', 'sanity', 'stress', 'bleeding', 'radiation', 'infection', 'poison']

const CONDITION_THRESHOLD = {
    hunger: { value: 50, type: 'below' },
    thirst: { value: 50, type: 'below' },
    oxygen: { value: 75, type: 'below' },
    sanity: { value: 50, type: 'below' },
    stress: { value: 10, type: 'above' },
    bleeding: { value: 0, type: 'above' },
    radiation: { value: 0, type: 'above' },
    infection: { value: 0, type: 'above' },
    poison: { value: 0, type: 'above' }
}

const VOICE_MODES = {
    normal: { label: 'NORM', class: 'voice_normal' },
    whisper: { label: 'WHIS', class: 'voice_whisper' },
    shout: { label: 'SHOU', class: 'voice_shout' }
}

const get_condition_colour = (key, pct) => {
    const fixed = { bleeding: 'var(--status_bleeding)', radiation: 'var(--status_radiation)', infection: 'var(--status_infection)', poison: 'var(--status_poison)', stress: 'var(--status_stress)' }
    if (fixed[key]) return fixed[key]
    if (pct <= 25) return 'var(--notify_error)'
    if (pct <= 50) return 'var(--notify_warning)'
    return 'var(--status_hunger)'
}

const should_show_condition = (key, value, max) => {
    const threshold = CONDITION_THRESHOLD[key]
    if (!threshold) return false
    const pct = (value / max) * 100
    if (threshold.type === 'above') return pct > threshold.value
    return pct <= threshold.value
}

export class StatusHUD {
    constructor() {
        this.statuses = {}
        this.voice = 'normal'
        this.container = null
        this.maxes = { health: 200, armour: 100, hunger: 100, thirst: 100, stamina: 100, oxygen: 100, temperature: 50, sanity: 100, stress: 100, bleeding: 100, radiation: 100, infection: 100, poison: 100 }
        this.build()
    }

    build() {
        $('#status_hud').remove()
        this.container = $(`
            <div id="status_hud">
                <div class="hud_conditions" id="hud_conditions"></div>
                <div class="hud_player">
                    <div class="hud_headshot" id="hud_headshot">
                        <div class="hud_headshot_fallback">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <circle cx="12" cy="8" r="4"/>
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                            </svg>
                        </div>
                    </div>
                    <div class="hud_bars">
                        <div class="hud_bar_row">
                            <div class="hud_bar_icon">${SVG_ICONS.health}</div>
                            <div class="hud_bar_track">
                                <div class="hud_bar_fill" id="bar_fill_health"></div>
                            </div>
                        </div>
                        <div class="hud_bar_row">
                            <div class="hud_bar_icon">${SVG_ICONS.armour}</div>
                            <div class="hud_bar_track">
                                <div class="hud_bar_fill" id="bar_fill_armour"></div>
                            </div>
                            
                        </div>
                    </div>
                    <div class="hud_side">
                        <div class="hud_side_row">
                            <div class="hud_bar_icon">${SVG_ICONS.temperature}</div>
                            <div class="hud_side_value" id="hud_temp">37°C</div>
                        </div>
                        <div class="hud_side_row">
                            <div class="hud_bar_icon">${SVG_ICONS.voice}</div>
                            <div class="hud_side_value voice_normal" id="hud_voice">NORM</div>
                        </div>
                    </div>
                </div>
            </div>
        `)
        $('#ui_container').append(this.container)
    }

    rebuild_conditions() {
        const $container = $('#hud_conditions')
        $container.empty()
        CONDITION_KEYS.forEach(key => {
            const value = this.statuses[key]
            if (value === undefined) return
            const max = this.maxes[key]
            if (!should_show_condition(key, value, max)) return
            const pct = (value / max) * 100
            const colour = get_condition_colour(key, pct)
            $container.append(`<div class="hud_condition_icon" style="color: ${colour}">${SVG_ICONS[key] || ''}</div>`)
        })
    }

    update_bar(key, value, max) {
        const $fill = $(`#bar_fill_${key}`)
        if (!$fill.length) return
        const pct = Math.max(0, Math.min(100, (value / max) * 100))
        $fill.css('width', `${pct}%`)
        $fill.toggleClass('critical', pct < 25)
    }

    update_temperature(value) {
        $('#hud_temp').text(`${value.toFixed(1)}°C`)
    }

    update_voice(mode) {
        const vm = VOICE_MODES[mode] || VOICE_MODES.normal
        $('#hud_voice')
            .text(vm.label)
            .attr('class', `hud_side_value ${vm.class}`)
    }

    set_headshot(src) {
        $('#hud_headshot').empty().append(`<img src="${src}" alt="player">`)
    }

    set_voice(mode) {
        this.voice = mode
        this.update_voice(mode)
    }

    update(statuses) {
        if (!statuses) return
        this.statuses = { ...this.statuses, ...statuses }
        if (statuses.health !== undefined) this.update_bar('health', statuses.health, this.maxes.health)
        if (statuses.armour !== undefined) this.update_bar('armour', statuses.armour, this.maxes.armour)
        if (statuses.temperature !== undefined) this.update_temperature(statuses.temperature)
        this.rebuild_conditions()
    }

    show() { this.container.removeClass('hud_hidden') }
    hide() { this.container.addClass('hud_hidden') }
    destroy() { this.container.remove() }
}

/*
const hud = new StatusHUD()

hud.update({
    health: 30,
    armour: 10,
    hunger: 15,
    thirst: 20,
    stamina: 10,
    oxygen: 10,
    temperature: 37,
    sanity: 60,
    stress: 10,
    bleeding: 75,
    radiation: 30,
    infection: 20,
    poison: 100
})
*/