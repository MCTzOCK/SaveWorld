using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LootPlacer : MonoBehaviour
{
    
    public float left_x = -2.25f;
    public float right_x = 2.25f;
    public float middle_x = 0f;
    // Start is called before the first frame update
    void Start()
    {
        GameObject loot = transform.GetChild(1).gameObject;
        float random = Random.Range(0, 3);

        loot.transform.position = random switch
        {
            0 => new Vector3(left_x, loot.transform.position.y, loot.transform.position.z),
            1 => new Vector3(middle_x, loot.transform.position.y, loot.transform.position.z),
            2 => new Vector3(right_x, loot.transform.position.y, loot.transform.position.z),
            _ => loot.transform.position
        };
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
