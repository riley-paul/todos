//
//  make-request.swift
//  todos
//
//  Created by Riley James Paul on 2026-04-13.
//

import Foundation

func makeRequest(to path: String) -> URLRequest {
    var request = URLRequest(
        url: baseUrl.appendingPathComponent("api").appendingPathComponent(path))
    if let token = KeychainHelper.load(forKey: "session_token") {
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }
    return request
}
