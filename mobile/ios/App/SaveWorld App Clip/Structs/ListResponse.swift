//
//  ListResponse.swift
//  SaveWorld App Clip
//
//  Created by Ben on 13.01.24.
//

import Foundation

struct ListResponse: Decodable {
    var entries: [Project];
    var status: Int;
    var pages: Int;
}
