//
//  Urls.swift
//  todos
//
//  Created by Riley James Paul on 2026-04-13.
//

import Foundation

let baseUrl = URL(string: "http://localhost:4321")!
let loginUrl = URL(string: "http://localhost:4321/login/google?platform=native")!
let logoutUrl = baseUrl.appendingPathComponent("logout")
