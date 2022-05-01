/**
 * 船
 */
class Ship extends PawnObject
{
    get NowEnergy() { return this._now_energy; }
    get MaxEnergy() { return this._max_energy; }

    constructor()
    {
        super();

        this._automa = 0;
        this._missle_mng = null;
        this._effect_mng = null;
        this._img_w = 60;
        this._img_h = 40;
        this._now_energy = 0;
        this._max_energy = 0;
        this._muteki_count = 0;
    }

    Init(in_x, in_y, in_img_no, in_energy_max, in_missle_mng, in_effect_mng)
    {
        super.Init(in_x, in_y, in_img_no, 30);
        this._now_energy = this._max_energy = in_energy_max;
        this._effect_mng = in_effect_mng;
        this._missle_mng = in_missle_mng;
    }

    Update(in_game_timer, in_scr_w, in_scr_h)
    {
        super.Update(in_game_timer);

        if (key[37] > 0 && this._ssX > this._img_w) this._ssX -= 20;
        if (key[39] > 0 && this._ssX < in_scr_w - this._img_w) this._ssX += 20;
        if (key[38] > 0 && this._ssY > this._img_h) this._ssY -= 20;
        if (key[40] > 0 && this._ssY < in_scr_h - this._img_h) this._ssY += 20;
        if (key[65] == 1)
        {
            key[65]++;
            this._automa = 1 - this._automa;
        }
        if ((key[32] == 1) && (this._automa == 0))
        {
            key[32]++;
            this._missle_mng.Fire(this._ssX + 40, this._ssY, 40, 0, "s01");
        }
        else if ((this._automa == 1) && ((in_game_timer % 8) == 0))
        {
            in_missle_mng.Fire(this.X + 40, this.Y, 40, 0, "s01");
        }
    }

    Draw()
    {
        if ((this._muteki_count % 2) == 0)
            super.Draw();
        if (this._muteki_count > 0)
            --this._muteki_count;
    }

    EventHit(in_hit_obj)
    {
        if (this._muteki_count > 0)
            return;

        let b_hit = false;
        if (in_hit_obj instanceof EnemyBase)
            b_hit = true;
        if (in_hit_obj instanceof MissleEnemy)
            b_hit = true;

        if (b_hit)
        {
            --this._now_energy;
            this._muteki_count = 30;
        }
    }
}