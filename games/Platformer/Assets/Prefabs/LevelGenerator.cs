using System;
using System.Collections;
using UnityEngine;

public class FloorSpawner : MonoBehaviour
{
    public GameObject floorPrefab;
    public int floorCount = 0;
    public ArrayList floorList;
    private float floorLength;
    private GameObject player;
    
    void Start()
    {
        floorLength = floorPrefab.transform.GetChild(0).localScale.z;
        player = GameObject.FindGameObjectWithTag("Player");
        floorList = new ArrayList();
        
        for (int i = 0; i < 10; i++)
        {
            SpawnFloor();
        }
    }

    // Update is called once per frame
    void Update()
    {
        if (player.transform.position.z > floorCount * 20 - 120)
        {
            SpawnFloor();
        }
        
        if(floorList.Count > 20)
        {
            DestroyFloor();
        }
    }
    
    void SpawnFloor()
    {
        GameObject floor = Instantiate(floorPrefab, new Vector3(0, 0, floorCount * 20), Quaternion.identity);
        floorList.Add(floor);
        floorCount++;
    }
    
    void DestroyFloor()
    {
        print("Destroying floor...");
        Destroy(((GameObject)floorList[0]).gameObject);
        floorList.RemoveAt(0);
    }
}
