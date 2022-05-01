/**
 * PawnObjectの配列同士のコリジョンチェック
 * @param {*} in_pawn_object_array 
 * @param {*} in_pawn_object_array2 
 */
function CheckHitPawnObjectArrayToPaanObjectArray(
	in_pawn_object_array,
	in_pawn_object_array2)
{
    in_pawn_object_array.forEach(in_pawn_object => {
        if (in_pawn_object != null) {
            in_pawn_object_array2.forEach(in_hit_obj=> {
                if (in_hit_obj != null)
                {
                    if (in_pawn_object.Hit(in_hit_obj))
                    {
                        in_pawn_object.EventHit(in_hit_obj);
                        in_hit_obj.EventHit(in_pawn_object);
                    }
                }
            });
        }
    });
}