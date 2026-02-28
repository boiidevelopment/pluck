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

const FALLBACK_ICONS = {
    primary: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bow-arrow-icon lucide-bow-arrow"><path d="M17 3h4v4"/><path d="M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17"/><path d="M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05"/><path d="M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z"/><path d="M9.707 14.293 21 3"/></svg>`,
    secondary: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sword-icon lucide-sword"><path d="m11 19-6-6"/><path d="m5 21-2-2"/><path d="m8 16-4 4"/><path d="M9.5 17.5 21 6V3h-3L6.5 14.5"/></svg>`,
    sidearm: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-construction-icon lucide-construction"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/></svg>`
}

export class WeaponHUD {
    constructor() {
        this.slots = {
            primary: null,
            secondary: null,
            sidearm: null
        }
        this.active = 'primary'
        this.container = null
        this.build()
    }

    build() {
        $('#weapon_hud').remove()
        this.container = $(`
            <div id="weapon_hud" class="hud_hidden">
                <div class="whud_active" id="whud_active">
                    <div class="whud_active_image" id="whud_active_image">
                        ${FALLBACK_ICONS.primary}
                    </div>
                    <div class="whud_active_info">
                        <div class="whud_active_ammo" id="whud_active_ammo">
                            <span class="whud_ammo_clip" id="whud_ammo_clip">0</span>
                            <span class="whud_ammo_sep">/</span>
                            <span class="whud_ammo_reserve" id="whud_ammo_reserve">0</span>
                        </div>
                    </div>
                </div>
                <div class="whud_inactive">
                    <div class="whud_slot" id="whud_slot_secondary">
                        <div class="whud_slot_image">${FALLBACK_ICONS.secondary}</div>
                    </div>
                    <div class="whud_slot" id="whud_slot_sidearm">
                        <div class="whud_slot_image">${FALLBACK_ICONS.sidearm}</div>
                    </div>
                </div>
            </div>
        `)
        $('#ui_container').append(this.container)
    }

    render_slot(slot_key) {
        const data = this.slots[slot_key]
        const fallback = FALLBACK_ICONS[slot_key] || FALLBACK_ICONS.primary
        if (slot_key === this.active) {
            $('#whud_ammo_clip').text(data?.ammo_clip ?? 0)
            $('#whud_ammo_reserve').text(data?.ammo_reserve ?? 0)
            const $img = $('#whud_active_image')
            $img.empty()
            if (data?.image) {
                $img.append(`<img src="${data.image}" alt="${data.name}">`)
            } else {
                $img.html(fallback)
            }
            $('#whud_active').toggleClass('whud_empty', !data)
        } else {
            const $slot = $(`#whud_slot_${slot_key}`)
            if (!$slot.length) return
            const $img = $slot.find('.whud_slot_image')
            $img.empty()
            if (data?.image) {
                $img.append(`<img src="${data.image}" alt="${data.name}">`)
            } else {
                $img.html(fallback)
            }
            $slot.toggleClass('whud_empty', !data)
            $slot.toggleClass('whud_no_sidearm', slot_key === 'sidearm' && !data)
        }
    }

    set_weapon(slot, data) {
        this.slots[slot] = data
        this.render_slot(slot)
    }

    set_active(slot) {
        this.active = slot
        Object.keys(this.slots).forEach(k => this.render_slot(k))
    }

    update_ammo(clip, reserve) {
        if (this.slots[this.active]) {
            this.slots[this.active].ammo_clip = clip
            this.slots[this.active].ammo_reserve = reserve
        }
        $('#whud_ammo_clip').text(clip)
        $('#whud_ammo_reserve').text(reserve)
    }

    show() { this.container.removeClass('hud_hidden') }
    hide() { this.container.addClass('hud_hidden') }
    destroy() { this.container.remove() }
}

/*
const hud = new WeaponHUD()

hud.set_weapon('primary', { ammo_clip: 28, ammo_reserve: 90 })
hud.set_active('primary')
hud.show()
*/