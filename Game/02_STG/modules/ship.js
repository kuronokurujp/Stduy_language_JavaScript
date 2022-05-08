/**
 * 船
 */
class Ship extends PawnObject
{
    static get MISSLE_COOLDOWN_COUNT_MAX() { return 8; }
    static get MISSLE_INIT_SPEED() { return 40; }
    static get MOVE_INIT_SPEED() { return 10; }
    static get MUTEKI_COUNT_MAX() { return 30; }
    static get BULLET_MAX() { return 8; }

    get NowEnergy() { return this._now_energy; }
    get MaxEnergy() { return this._max_energy; }
    get ImgW() { return this._img_w; }
    get ImgH() { return this._img_h; }
    get MoveSpeed() { return this._move_speed; }

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
        this._missle_speed = Ship.MISSLE_INIT_SPEED;
        this._missle_cooldown_count = 0;
        this._move_speed = Ship.MOVE_INIT_SPEED;
        this._missle_type = MissileType.MS01;
        this._laser_enable_count = 0;
        this._bullet_num = 1;
        this._b_fire = false;
    }

    Init(in_x, in_y, in_img_no, in_energy_max, in_missle_mng, in_effect_mng)
    {
        super.Init(in_x, in_y, in_img_no, 30);
        this._now_energy = this._max_energy = in_energy_max;
        this._muteki_count = 0;
        this._missle_speed = Ship.MISSLE_INIT_SPEED;
        this._missle_cooldown_count = 0;
        this._move_speed = Ship.MOVE_INIT_SPEED;
        this._missle_type = MissileType.MS01;
        this._laser_enable_count = 0;
        this._bullet_num = 1;
        this._b_fire = false;

        this._effect_mng = in_effect_mng;
        this._missle_mng = in_missle_mng;
    }

    Update(in_game_timer)
    {
        super.Update(in_game_timer);

        let b_fire = (this._automa == 1) || this._b_fire;
        this._b_fire = false;

        // 弾を撃つためのクールダウン更新
        {
            if (0 < this._missle_cooldown_count)
                --this._missle_cooldown_count;
        }

        // 弾を撃つ
        {
            if ((b_fire === true) && (this._missle_cooldown_count == 0))
            {
                let offset_scale = this._bullet_num - 1;
                for (let i = 0; i < this._bullet_num; ++i)
                {
                    this._missle_mng.Fire(
                        this.X + this._img_w / 2,
                        this.Y - offset_scale * (12 / 2) + i * 12,
                        this._missle_speed,
                        int((i - offset_scale / 2) * 2),
                        this._missle_type);
                }

                switch (this._missle_type.Name)
                {
                    case MissileType.MS01.Name: {
                        break;
                    }
                    case MissileType.MS02.Name: {
                        --this._laser_enable_count;
                        if (this._laser_enable_count <= 0)
                            this._missle_type = MissileType.MS01;

                        break;
                    }
                }

                this._missle_cooldown_count = Ship.MISSLE_COOLDOWN_COUNT_MAX;
            }
        }
    }

    Draw()
    {
        if ((this._muteki_count % 2) == 0)
            super.Draw();

        if (this._muteki_count > 0)
            --this._muteki_count;
    }

    IsHit(in_check_obj)
    {
        if ((in_check_obj instanceof EnemyBase) || (in_check_obj instanceof MissileEnemy))
            return (this._muteki_count <= 0);
        else if (in_check_obj instanceof ItemBase)
            return true;

        return false;
    }

    EventHit(in_hit_obj)
    {
        if ((in_hit_obj instanceof EnemyBase) || (in_hit_obj instanceof MissileEnemy))
        {
            --this._now_energy;
            this._now_energy = Math.min(this._max_energy, this._now_energy);
            this._now_energy = Math.max(0, this._now_energy);

            this._muteki_count = Ship.MUTEKI_COUNT_MAX;
        }
        else if (in_hit_obj instanceof ItemChangeLaser)
        {
            this._missle_type = MissileType.MS02;
            this._laser_enable_count = 10;
        }
        else if (in_hit_obj instanceof ItemCureEnergy)
        {
            ++this._now_energy;
            this._now_energy = Math.min(this._now_energy, this._max_energy);
        }
        else if (in_hit_obj instanceof ItemPlusBullet)
        {
            ++this._bullet_num;
            this._bullet_num = Math.min(this._bullet_num, Ship.BULLET_MAX);
        }
    }

    ChangeAutoMisslelMode()
    {
        this._automa = 1 - this._automa;
    }

    FireSwitch()
    {
        this._b_fire = true;
    }
}