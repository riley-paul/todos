//
//  ListModel.swift
//  todos
//
//  Created by Riley James Paul on 2026-04-13.
//

import Foundation

struct ListModel: Identifiable, Codable, Hashable {
    var id: String
    var name: String
    var todoCount: Int
}
